//
//  NewExpenseViewController.swift
//  ConArtist
//
//  Created by Cameron Eldridge on 2018-02-26.
//  Copyright © 2018 Cameron Eldridge. All rights reserved.
//

import UIKit
import RxSwift

class NewExpenseViewController: UIViewController {
    fileprivate static let ID = "NewExpense"
    @IBOutlet weak var navBar: FakeNavBar!
    @IBOutlet weak var categoryTextField: FancyTextField!
    @IBOutlet weak var amountTextField: FancyTextField!
    @IBOutlet weak var descriptionTextView: UITextView!
    @IBOutlet weak var noteLabel: UILabel!

    fileprivate let disposeBag = DisposeBag()
    fileprivate var editingExpense: Expense?
    fileprivate let results = PublishSubject<(String, String, Money)>()
    fileprivate let ømoney = Variable<Money?>(nil)
}

// MARK: - Lifecycle
extension NewExpenseViewController {
    override func viewDidLoad() {
        setupSubscriptions()
        setupLocalization()
        noteLabel.font = noteLabel.font.usingFeatures([.smallCaps])
        amountTextField.format = { Money.parse(as: ConArtist.model.settings.value.currency, $0)?.toString() ?? $0 }
        if let expense = editingExpense {
            descriptionTextView.text = expense.description
            categoryTextField.text = expense.category
            amountTextField.text = "\(expense.price.numericValue())"
            ømoney.value = expense.price
        }
    }
}

// MARK: - Localization
extension NewExpenseViewController {
    fileprivate func setupLocalization() {
        navBar.title = editingExpense == nil ? "New Expense"¡ : "Editing Expense"¡
        navBar.leftButtonTitle = "Back"¡
        navBar.rightButtonTitle = "Save"¡
        amountTextField.title = "Amount"¡
        amountTextField.placeholder = "Amount"¡
        categoryTextField.title = "Category"¡
        categoryTextField.placeholder = "Category"¡
    }
}

// MARK: - Subscriptions
extension NewExpenseViewController {
    fileprivate func setupSubscriptions() {
        navBar.leftButton.rx.tap
            .subscribe(onNext: { [view] _ in
                view?.endEditing(true)
                ConArtist.model.navigate(back: 1)
            })
            .disposed(by: disposeBag)

        amountTextField.rx.text
            .map { $0 ?? "" }
            .map { Money.parse(as: ConArtist.model.settings.value.currency, $0) }
            .bind(to: ømoney)
            .disposed(by: disposeBag)

        let øform = Observable.combineLatest(
            categoryTextField.rx.text.map { $0 ?? "" },
            descriptionTextView.rx.text.map { $0 ?? "" },
            ømoney.asObservable().filterMap(identity)
        )

        navBar.rightButton.rx.tap
            .withLatestFrom(øform)
            .subscribe(onNext: { [results, view] result in
                results.onNext(result)
                view?.endEditing(true)
                ConArtist.model.navigate(back: 1)
            })
            .disposed(by: disposeBag)

        categoryTextField.rx.text
            .map { $0 ?? "" }
            .map { !$0.isEmpty && $0.count < 32 }
            .bind(to: categoryTextField.isValid)
            .disposed(by: disposeBag)

        categoryTextField.rx.controlEvent([.editingDidEndOnExit])
            .subscribe(onNext: { [amountTextField] _ in amountTextField?.becomeFirstResponder() })
            .disposed(by: disposeBag)

        amountTextField.rx.controlEvent([.editingDidEndOnExit])
            .subscribe(onNext: { [descriptionTextView] _ in descriptionTextView?.becomeFirstResponder() })
            .disposed(by: disposeBag)

        ømoney
            .asObservable()
            .map { $0 != nil }
            .bind(to: amountTextField.isValid)
            .disposed(by: disposeBag)

        Observable
            .combineLatest(
                categoryTextField.isValid.asObservable(),
                amountTextField.isValid.asObservable()
            )
            .map { $0 && $1 }
            .bind(to: navBar.rightButton.rx.isEnabled)
            .disposed(by: disposeBag)
    }
}

// MARK: - Navigation
extension NewExpenseViewController {
    class func show(editing expense: Expense? = nil) -> Observable<(String, String, Money)> {
        let controller: NewExpenseViewController = NewExpenseViewController.instantiate(withId: NewExpenseViewController.ID)
        controller.editingExpense = expense
        ConArtist.model.navigate(present: controller)
        return controller.results.asObservable()
    }
}
