import React from 'react'
import firebase from 'firebase/app'
import 'firebase/database'


const PriceType = ({priceType, roomId, name}) => {

  const handlePriceChange = event => {
    const e = event.target
    const {value} = e
    const people = e.getAttribute("data-people")
    const priceType = e.getAttribute("data-price-type")
    firebase.database().ref(`/rooms/${roomId-1}/prices/${priceType}/${people}/price`).set(parseInt(value,10) || 0)
  }

  const priceTypeList = []
  Object.keys(priceType).forEach(permutation => {
    const {adults, children, price} = priceType[permutation]
    // console.log(name);
    const adultsString = `${adults} felnőtt`
    const childrenString = children && children !== 0 ? `, ${children} gyerek` : ""
    priceTypeList.push(
      <li key={`${adults}_${children}`}>
        <p>{adultsString}{childrenString}:</p>
        <input
            className="room-number-input"
            type="number"
            data-people={permutation}
            data-price-type={name}
            value={price}
            onChange={e => handlePriceChange(e)}/>
        </li>
      )
    })

  return(
    <ul
      data-type={name}
      className={`price-list ${name !== "allInclusive" && "hidden"}`}
    >
      {priceTypeList}
    </ul>
  )
}


const Prices = ({prices, roomId}) => {
//
  const handlePriceMenuClick = event => {
    const e = event.target
    const type = e.getAttribute("data-type")
    Array.from(document.querySelectorAll(".price-list")).forEach(priceType => {
      if (priceType.getAttribute("data-type") === type) {
        priceType.classList.remove("hidden")
      } else {
        priceType.classList.add("hidden")
      }
    })
    Array.from(document.querySelectorAll(".price-list-menu")).forEach(menu => {
      if (menu.getAttribute("data-type") !== type) {
        menu.classList.remove("price-list-menu-active")
      } else {
        menu.classList.add("price-list-menu-active")
      }
    })
  }

  const pricesList = []
  const pricesListMenu = []
  Object.keys(prices).forEach(priceType => {
    pricesList.push(
      <PriceType key={priceType} name={priceType} id={roomId} priceType={prices[priceType]}/>
    )
    let priceTypeListName = ""
    switch (priceType) {
      case "allInclusive":
        priceTypeListName = "All inclusive"
        break
      case "breakfast":
        priceTypeListName = "Reggelivel"
        break
      case "fullBoard":
        priceTypeListName = "Teljes ellátás"
        break
      case "halfBoard":
        priceTypeListName = "Félpanzió"
        break
      default:
        return
    }
    pricesListMenu.push(
      <li
        key={priceType}
        className={`price-list-menu ${priceType === "allInclusive" && "price-list-menu-active"}`}
        data-type={priceType}
        onClick={e => handlePriceMenuClick(e)}
      >
        <h5
          data-type={priceType}
          onClick={e => handlePriceMenuClick(e)}
        >{priceTypeListName}</h5>
      </li>
    )
  })

  return(
    <div>
      <p>Árak (HUF):</p>
      <ul className="prices-list-menu">
        {pricesListMenu}
      </ul>
      <ul className="prices-list">
        {pricesList}
      </ul>
    </div>
  )
}

export default Prices
