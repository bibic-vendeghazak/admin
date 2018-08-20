import React from 'react'
import {TableHead, TableRow, TableCell, Hidden, Tooltip, TableSortLabel} from '@material-ui/core'

const columns = [
  {
    label: "",
    id: "handled",
    padding: "checkbox"
  },
  {
    label: "azonosító",
    id: "id",
    padding: "dense",
    mdUp: true
  },
  {
    label: "név",
    id: "name",
    padding: "none"
  },
  {
    label: "szoba",
    id: "roomId",
    padding: "checkbox",
    smDown: true
  },
  {
    label: "email",
    id: "email",
    mdDown: true,
    padding: "none"
  },
  {
    label: "telefon",
    id: "tel",
    mdDown: true,
    padding: "none"
  },
  {
    label: "érkezés",
    id: "from",
    smDown: true
  },
  {
    label: "távozás",
    id: "to",
    smDown: true
  },
  {
    label: "módosítva",
    id: "timestamp",
    mdDown: true
  },
  {
    label: "",
    id: "details",
    padding: "checkbox"
  }
]


const EnhancedTableHead = ({order, orderBy, onRequestSort}) =>
  <TableHead>
    <TableRow>
      {columns.map(({
        id, label, numeric=true, padding="default", ...breakpoints
      }) => {
        return (
          <Hidden
            key={id}
            {...breakpoints}
          >
            <TableCell
              sortDirection={orderBy === id ? order : false}
              {...{numeric, padding}}
            >
              {id !== "handled" &&
                <Tooltip
                  enterDelay={300}
                  title={`Rendezés (${order==="desc" ?"növekvő" : "csökkenő" })`}
                >
                  <TableSortLabel
                    active={orderBy === id}
                    direction={order}
                    onClick={() => onRequestSort(id)}
                  >
                    {label}
                  </TableSortLabel>
                </Tooltip>
              }
            </TableCell>
          </Hidden>
        )
      })}
    </TableRow>
  </TableHead>


export default EnhancedTableHead
