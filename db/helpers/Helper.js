const db = require('../dbConfig');

module.exports = {
    
// ### Getting all the posts
    getPosts: () => {
        const query = db('posts');
        return query.then(posts => {
            return posts.map(post => {
                return {
                    ...post
                }
            })
        })
    },

    // ### retrieve a post by its id
    getPost: (id) => {
        return db('posts').select().where('id', id);
    },

    // ### Posting a new post
    addPost: (post) => {
        return db('posts')
            .insert(post)
    },

    // ### Updating post
    updatePost: (id, updatedPost) => {
        return db('posts')
                .where('id', id)
                .update(updatedPost)
    },

    // Deleting post
    deletePost: (id) => {
        return db('posts')
                .where('id', id)
                .delete()
    },
}