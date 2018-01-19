import React from 'react'
import Badge from 'material-ui/Badge'


export const colors = {
    orange: "#fe4536",
    lightBrown: "#482c29",
    darkBrown: "#1f1511"
}

export const TabLabel = ({title, count}) => (
    <div style={{display:"flex", alignItems: "center"}}>
      <div>{title}</div>
      <Badge style={{marginLeft: 12, padding: 12}} primary badgeContent={count}/>
    </div>
)