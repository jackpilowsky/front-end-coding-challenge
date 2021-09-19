export default class TagBrowserWidget {
  constructor(config) {
    this.config = config;

    fetch('/js/data.json')
      .then((response) => response.json())
      // use .bind because native promises change the "this" context
      .then(this.setData.bind(this))
      .then(this.getElements.bind(this))
      .then(this.bindEventListeners.bind(this))
      .then(this.renderTagList.bind(this));

    console.log('Widget Instance Created');
  }

  setData(data) {
    this.data = data;
    console.log('Data fetched', this.data);
  }

  getElements() {
    this.tagList = this.config.element.querySelectorAll('.tag-list')[0];
    // find and store other elements you need
    this.matchingItemsList = this.config.element.querySelectorAll('.matching-items-list')[0]
  }

  bindEventListeners() {
    this.tagList.addEventListener('click', this.tagListClicked.bind(this));
    // bind the additional event listener for clicking on a series title
  }

  renderTagList() {
    // render the list of tags from this.data into this.tagList
    const fullTagList =  this.data.flatMap(book=> book.tags).sort()
    // dedup
    const uniqueTags = [...new Set(fullTagList)];
    //render 
    const html = uniqueTags.map(tag=>`<li><span class="tag is-link">${tag}</span></li>`).join('')
    this.tagList.innerHTML = html
  }

  tagListClicked(event) {
    console.log('tag list (or child) clicked', event);
    // check to see if it was a tag that was clicked and render
    // the list of series that have the matching tags
    const tag = event.target.innerHTML
    const matchingBooks = this.data.filter(book=>{
      return book.tags.find(bookTag =>bookTag.toLowerCase() === tag.toLowerCase())
    })
    // update the active class
    const active = this.tagList.querySelectorAll('.active')
    if(active.length > 0){
      active.forEach(li => li.classList.remove('active'))
    }
    event.target.classList.add('active')
    // render list
    const html = matchingBooks.map(book=>`<li>${book.title}</li>`).join('')
    this.matchingItemsList.innerHTML = html
    // render list title
    const subtitle = this.matchingItemsList.previousElementSibling;
    subtitle.innerHTML = tag
  }
}
