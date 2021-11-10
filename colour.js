const colourRow = () => {

  const rowIds = [...document.getElementsByClassName('info_bold')]
  const productIDs = rowIds.map(id => {
    return id.children[2].children[0].title
  })

  productIDs.forEach(async id => {
    const getImage = async (id) => {
      const response = await fetch(`https://bo.icecat.biz/restful/v3/Gallery/${id}?AccessKey=${accesskey.val}`)
      if (response.ok) {
        const json = await response.json()
        const imageLanguageId = (json.Data[0].Locales[0].LanguageId)
        if (imageLanguageId === 0) {
          if (json.Data[0].Locales[0].Type === 'ProductImage') {
            const title = `[title="${id}"]`
            document.body.querySelector(title).style.backgroundColor = '#47ff4d87'
          }
        }
      }
    }
    await getImage(id)
  })

}

colourRow()
