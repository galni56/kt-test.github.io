let storage = {
  apiKey: '114aa4bad708a3d95a838db951091760',
  sessionId: localStorage.getItem('session_id') || null,
  pageTitlePostfix: ' — ' + document.title,
  listTypes: [
    {
      title: 'Popular Movies',
      shortTitle: 'Popular',
      query: 'popular',
      type: 'collection',
      isCategory: true
    },
    {
      title: 'Top Rated Movies',
      shortTitle: 'Top Rated',
      query: 'top_rated',
      type: 'collection',
      isCategory: true
    },
    {
      title: 'Search Results',
      query: 'search',
      isCategory: false
    }
  ],
  categories: {},
};

// Create categories titles
storage.listTypes.forEach(function(listType){
  storage.categories[listType.query] = listType.title;
});

export default storage;
