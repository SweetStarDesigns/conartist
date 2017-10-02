module VInventory exposing (view)
import Html exposing (Html, div, text)
import Html.Attributes exposing (class, type_, disabled)
import Html.Events exposing (onInput, onClick)

import Model exposing (Model)
import Msg exposing (Msg(..))
import Tabs exposing (tabsWithFooter, TabItem(..))
import ProductType exposing (ProductType, FullType)
import Product exposing (FullProduct)
import Table exposing (table)
import Join exposing (ProductWithType)
import Page exposing (InventoryPageState)
import Fancy exposing (ButtonStyle(..))

view : Model -> InventoryPageState -> Html Msg
view model page =
  let tabList =
    model.user.productTypes
      |> List.map ProductType.normalize
      |> List.filter (\p -> not p.discontinued)
      |> List.map (\t -> (t.name, inventoryTab model t))
      |> List.map Tab
  in
    tabsWithFooter (inventoryFooter model page.current_tab) ChangeInventoryTab [ class "inventory" ] (tabList ++ [ newTabButton ]) page.current_tab

inventoryTab : Model -> FullType -> Html Msg
inventoryTab model pt =
  div
    [ class "inventory__tab" ]
    [ table
      [ "Name", "Quantity", "Discontinue" ]
      inventoryRow
      ( Join.productsWithTypes
        (model.user.productTypes
          |> List.map ProductType.normalize
          |> List.filter (\p -> not p.discontinued))
        (model.user.products
          |> List.map Product.normalize
          |> List.filter (\p -> p.type_id == pt.id)
          |> List.filter (\p -> not p.discontinued) ) ) ]

inventoryRow : ProductWithType -> List (Html Msg)
inventoryRow { id, name, quantity, product_type, discontinued } =
  [ Fancy.input "" name [] [ type_ "text", onInput (ProductName product_type.id id) ]
  , Fancy.input "" (toString quantity) [] [ type_ "text", onInput (ProductQuantity product_type.id id) ]
  , Fancy.button Icon (if discontinued then "add_circle_outline" else "remove_circle_outline") [ onClick (ProductDiscontinued product_type.id id) ] ]

newTabButton : TabItem Msg
newTabButton = Button ("add", NewProductType)

inventoryFooter : Model -> Int -> List (Html Msg)
inventoryFooter model currentTab =
  case model.user.productTypes
    |> List.map ProductType.normalize
    |> (if model.show_discontinued then identity else List.filter (\t -> not t.discontinued))
    |> List.drop currentTab
    |> List.head
  of
    Just t ->
      [ Fancy.button Icon (if t.discontinued then "add_circle_outline" else "remove_circle_outline") [ onClick (ProductTypeDiscontinued t.id) ]
      , Fancy.input "" t.name [] [ onInput (ProductTypeName t.id) ]
      , Fancy.button Icon "format_color_fill" [ onClick ProductTypeColor ]
      , Fancy.button Icon "add" [ onClick NewProduct ]
      , Fancy.button Icon "save" [ onClick SaveTypes, disabled (not <| Model.isDirty model) ] ]
    Nothing -> []