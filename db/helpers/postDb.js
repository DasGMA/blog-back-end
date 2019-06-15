const db = require('../dbConfig.js');

module.exports = {
  
  get: function(id) {
    let query = db('posts as p');

    if (id) {
      query
        .join('users as u', 'p.userId', 'u.id')
        .select('p.category', 'p.title', 'p.content', 'p.created_at', 'p.updated_at', 'u.username as postedBy')
        .where('p.id', id);

      const promises = [query]; // [ posts ]

      return Promise.all(promises).then((results) => {
        let [posts] = results;
        let post = posts[0];

        return post;
      });
    }

    return query;
  },

  insert: function(post) {
    return db('posts')
      .insert(post)
      .then(ids => ({ id: ids[0] }));
  },

  update: function(id, post) {
    return db('posts')
      .where('id', id)
      .update(post);
  },

  remove: function(id) {
    return db('posts')
      .where('id', id)
      .del();
  },

};