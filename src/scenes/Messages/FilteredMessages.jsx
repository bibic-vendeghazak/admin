import React from 'react'
import {EmptyTableBody} from "../../components/shared"

import MessageRow from './MessageRow'


const filterByQuery = query => ({
  name, content, subject
}) =>
  query.some(word =>
    [name, content, subject]
      .map(e => e.toLowerCase())
      .join(" ")
      .includes(word)
  )


const FilteredMessages = ({
  Messages, query
}) => {

  const renderMessages = Messages =>
    Messages
      .filter(filterByQuery(query))
      .map(({
        id, ...Message
      }) =>
        <MessageRow id={id} key={id} {...Message}/>
      )

  Messages = renderMessages(Messages)
  return (
    Messages.length ? Messages : <EmptyTableBody/>
  )
}

export default FilteredMessages