package com.cameldridge.conartist

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.FragmentManager
import com.cameldridge.conartist.model.ConRequest.Failure
import com.cameldridge.conartist.model.ConRequest.Success
import com.cameldridge.conartist.model.Model
import com.cameldridge.conartist.scenes.ConventionListFragment
import com.cameldridge.conartist.scenes.SignInFragment
import com.cameldridge.conartist.services.Storage
import com.cameldridge.conartist.services.StorageKey
import com.cameldridge.conartist.services.api.API
import com.cameldridge.conartist.util.ConArtistFragment
import com.cameldridge.conartist.util.prettystring.Attribute.TextColor
import com.cameldridge.conartist.util.prettystring.Config
import com.cameldridge.conartist.util.prettystring.Rule
import com.cameldridge.conartist.util.extension.transaction
import java.lang.ref.WeakReference
import java.util.Stack
import java.util.Timer
import kotlin.concurrent.schedule

class ConArtistActivity : AppCompatActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    ConArtistActivity.fragmentManager = WeakReference(supportFragmentManager)

    setContentView(R.layout.activity_con_artist)

    configPrettyString()

    Storage.retrieve(StorageKey.AuthToken)?.let {
      API.authtoken = it
      API.request.reauthorize()
        .subscribe(
          { when (it) {
            is Success -> ConArtist.authorize(it.data)
            is Failure -> ConArtistActivity.signOut() // TODO: toast them here
          } },
          { } // TODO: show an error?
        )
      Model.setUser(Storage.retrieve(StorageKey.CurrentUser))
      Model.loadUser()
      set(ConventionListFragment())
    } ?: set(SignInFragment())
  }

  private fun configPrettyString() {
    Config.default = Config(
      listOf(TextColor(getColor(R.color.text))),
      listOf(Rule("action", listOf(TextColor(getColor(R.color.text_action)))))
    )
  }

  companion object {
    lateinit var fragmentManager: WeakReference<FragmentManager>

    private val fragments = Stack<ConArtistFragment>()

    private val backstackName get() = "${fragmentManager.get()!!.backStackEntryCount}"

    fun <T: ConArtistFragment> set(fragment: T) {
      fragmentManager.get()!!.transaction {
        replace(R.id.fragment_container, fragment)
        if (!fragments.isEmpty()) {
          fragments.pop()
        }
        fragments.push(fragment)
      }
    }

    fun <T: ConArtistFragment> replace(fragment: T) {
      val toRemove = fragments.pop()
      fragmentManager.get()!!.transaction {
        setCustomAnimations(R.anim.push, R.anim.leave, R.anim.come_back, R.anim.pop)
        hide(toRemove)
        add(R.id.fragment_container, fragments.push(fragment))
      }
      // Remove the fragment after the transition is completed.
      // This is kind of a hack, but whatever.
      Timer().schedule(500) {
        fragmentManager.get()!!.transaction {
          remove(toRemove)
        }
      }
    }

    fun <T: ConArtistFragment> push(fragment: T) {
      fragmentManager.get()!!.transaction {
        setCustomAnimations(R.anim.push, R.anim.leave, R.anim.come_back, R.anim.pop)
        hide(fragments.peek())
        add(R.id.fragment_container, fragments.push(fragment))
        addToBackStack(backstackName)
      }
    }

    fun <T: ConArtistFragment> present(fragment: T) {
      fragmentManager.get()!!.transaction {
        setCustomAnimations(R.anim.present, R.anim.fly, R.anim.fall, R.anim.dismiss)
        hide(fragments.peek())
        add(R.id.fragment_container, fragments.push(fragment))
        addToBackStack(backstackName)
      }
    }

    fun back() {
      fragmentManager.get()!!.popBackStack()
      fragments.pop()
    }

    fun signOut() {
      fragmentManager.get()!!.popBackStack("0", FragmentManager.POP_BACK_STACK_INCLUSIVE)
      set(SignInFragment())
    }
  }
}
