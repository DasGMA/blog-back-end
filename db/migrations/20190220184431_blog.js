
exports.up = function(knex) {
    return createUsersTable(knex)
      .then(createPostsTable)
      .catch(error => {
        console.log(error);
        reject(error);
      });
  };
  
  exports.down = function(knex) {
    return knex.schema
      .dropTableIfExists('posts')
      .then(function() {
        console.log('dropping posts');
        return knex.schema.dropTableIfExists('posts');
      })
      .then(function() {
        console.log('dropping users');
        return knex.schema.dropTableIfExists('users');
      })
      .catch(error => console.log(error));
  };
  
  function createUsersTable(knex) {
    console.log('creating users table');
  
    return new Promise(function(resolve, reject) {
      knex.schema
        .createTable('users', function(users) {
          users.increments(); // id, integer, unsigned no sign as not negative numbers
          users.string('username', 128).notNullable().unique();
          users.string('password').notNullable()
  
          console.log('users table created');
          resolve(knex);
        })
        .catch(error => reject(error));
    });
  }
  
  function createPostsTable(knex) {
    console.log('creating posts table');
  
    return new Promise(function(resolve, reject) {
      knex.schema
        .createTable('posts', function(posts) {
          posts.increments();
          posts.string('category').notNullable();
          posts.string('title').notNullable();
          posts.text('content').notNullable();
          posts.integer('userId').unsigned().notNullable().references('id').inTable('users');
          posts.timestamps(true, true);
  
          console.log('posts table created');
          resolve(knex);
        })
        .catch(error => reject(error));
    });
  }