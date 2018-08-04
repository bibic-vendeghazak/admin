import React from "react"
import {SortableContainer, SortableElement} from "react-sortable-hoc"
import TextParagraph from "./TextParagraph"

export const SortableItem = SortableElement(({value: [key, {text}], path}) =>
	<TextParagraph
		path={`${path}/${key}`}
		text={text}
	/>
)

export const SortableList = SortableContainer(({items, path}) =>
	<ul>
		{items.map((value, index) =>
			<SortableItem
				key={index}
				{...{value, index, path}}
			/>
		)}
	</ul>
)