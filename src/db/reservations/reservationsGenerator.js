[
  {
    'repeat(20)': {
      id: {
          publicDetails: {
            roomId: '{{integer(1,6)}}',
            from: '{{integer(2017,2018)}}-{{integer(8,12)}}-{{integer(1,28)}}',
            to: '{{integer(2017,2018)}}-{{integer(8,12)}}-{{integer(1,28)}}',
            handled: '{{bool()}}'
          },
          details: {
            name: '{{firstName()}} {{surname()}}',
            email: '{{lorem(1, "word")}}@{{lorem(1, "word")}}.com',
            tel: '+36-{{phone("xx-xxx-xxxx")}}',
            adults: '{{integer(1,6)}}',
            children: '{{integer(0,3)}}',
            message: '{{lorem(5, "words")}}.'
          }
		}
	}
  }
]

/* http://beta.json-generator.com */
