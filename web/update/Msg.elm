module Msg exposing (Msg(..), TabStatus)
import Http
import Date exposing (Date)
import Navigation exposing (Location)

import ConRequest exposing (ConRequest, Pagination)
import Product exposing (FullProduct)
import ProductType exposing (FullType)
import Price exposing (FullPrice)
import Convention exposing (MetaConvention, FullConvention)
import User exposing (User)
import Join exposing (ProductWithType)

type alias TabStatus =
  { current: Int
  , width: Float }

type Msg
  -- sign in
  = Email String
  | CEmail String
  | Password String
  | CPassword String
  | Terms Bool
  | ToggleSignIn
  | DoSignIn
  | DoSignOut
  | DidSignIn (Result Http.Error (ConRequest String))
  | DoCreateAccount
  | DidCreateAccount (Result Http.Error (ConRequest ()))
  | DidCheckExistingEmail (Result Http.Error (ConRequest Bool))
  -- dashboard
  | OpenKeyPurchase
  | OpenChooseConvention
  | AddConvention MetaConvention
  | AddedConvention (Result Http.Error (ConRequest ()))
  -- inventory
  | ChangeInventoryTab TabStatus
  | ColorPickerPage Int
  | ColorPickerOpen
  | ColorPickerClose
  | NewProductType
  | ProductTypeName Int String
  | ProductTypeColor Int Int
  | ProductTypeDiscontinued Int
  | NewProduct
  | ProductName Int Int String
  | ProductQuantity Int Int String
  | ProductDiscontinued Int Int
  | SortInventoryTable Int
  -- pricing
  | PricingAdd
  | PricingProductType Int (Maybe Int)
  | PricingProduct Int (Maybe Int)
  | PricingQuantity Int String
  | PricingPrice Int String
  | PricingRemove Int
  | SelectProductType Int
  | SelectProduct Int
  -- conventions
  | ChangeConventionTab TabStatus
  -- loading
  | DidLoadUser (Result Http.Error (ConRequest User))
  | DidLoadUserThen (Cmd Msg) (Result Http.Error (ConRequest User))
  | DidLoadChooseConvention (Result Http.Error (ConRequest (Pagination MetaConvention)))
  | DidLoadConvention (Result Http.Error (ConRequest FullConvention))
  -- saving
  | SaveProducts
  | SavePrices
  | SaveTypes
  | Save
  | SavedProducts (Result Http.Error (ConRequest (List FullProduct)))
  | SavedPrices (Result Http.Error (ConRequest (List FullPrice)))
  | SavedTypes (Result Http.Error (ConRequest (List FullType)))
  -- localStorage
  | LSRetrive (String, Maybe String)
  -- navigation
  | DoNav String
  | DidNav Location
  | SetDate Date
  | ToggleSidenav
  -- dialog
  | CloseDialog
  | EmptyDialog
  | DialogPage Int
  | ShowErrorMessage String
  -- other
  | Batch (List Msg)
  | Ignore
