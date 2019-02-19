
exports.up = function(knex, Promise) {
    return knex.schema.createTable('posts', table => {
      table.increments()
      table.string('category', 128).notNullable()
      table.string('title', 128).notNullable()
      table.text('content').notNullable()
      table.timestamps(true, true)
    })
  };
  
  exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('posts');
  };
