"use strict";
const fastify = require("fastify")({ logger: true });
const bcrypt = require("bcryptjs");
const { Client } = require("pg");
const autorization_settings = {
  user: "project_adminka",
  host: "localhost",
  database: "project_adminka",
  password: "Gys35168",
  port: 5432,
};

function checkProperty(object, property) {
  if (property in object == false)
    throw new Error(`Свойства ${property} нет в Объекте`);
}

async function get_login_state(object) {
  checkProperty(object, "password");
  checkProperty(object, "username");

  const client = new Client(autorization_settings);
  client.connect();

  let users_password = await client.query(
    "select password from users where username = $1",
    [object.username]
  );
  client.end();

  if (users_password.rowCount == 0) return false;

  users_password = users_password.rows[0].password;
  return await bcrypt.compare(object.password, users_password);
}

async function check_login(object) {
  if (!(await get_login_state(object))) throw new Error("permission denied");
}

fastify.post("/get/data", async (request, reply) => {
  try {
    const client = new Client(autorization_settings);
    client.connect();

    const data = await client.query("select * from data");
    client.end();

    if (data.rowCount == 0) throw new Error("table is empty");

    checkProperty(request.body, "data");
    checkProperty(request.body.data, "search_string");

    let data_after_search = data.rows;

    for (let search_string_item of request.body.data.search_string.split(" ")) {
      let data_during_search = [];
      /*for (
        let data_rows_count = 0;
        data_rows_count < data_after_search.length;
        data_rows_count++
      ) {*/
      for(let data_after_search_list of data_after_search){
        for (let data_row_property in data_after_search_list) {
          if (search_string_item == data_after_search_list[data_row_property])
            data_during_search.push(data_after_search_list);
        }
      }
      //}
      data_after_search = data_during_search;
    }

    for(let data_after_search_list of data_after_search) {
      delete data_after_search_list.text
      delete data_after_search_list.is_edited
    }

    return data_after_search;
    return data.rows;
  } catch (err) {
    return err;
  }
});

fastify.post("/get/user", async (request, reply) => {
  try {
    checkProperty(request.body, "authorization");
    await check_login(request.body.authorization);

    const client = new Client(autorization_settings);
    client.connect();

    const data = await client.query("select * from users where username = $1", [
      request.body.authorization.username,
    ]);
    client.end();

    if (data.rowCount == 0) throw new Error("table is empty");

    return data.rows;
  } catch (err) {
    return err;
  }
});

fastify.post("/get/login_state", async (request, reply) => {
  try {
    checkProperty(request.body, "authorization");
    return await get_login_state(request.body.authorization);
  } catch (err) {
    return err;
  }
});

async function get_permission_state(object, permission) {
  const client = new Client(autorization_settings);
  client.connect();

  const users = await client.query(
    "select attributes from users where username = $1",
    [object.username]
  );
  client.end();

  checkProperty(users.rows[0].attributes, "permissions");
  for (let users_permission of users.rows[0].attributes.permissions) {
    if (users_permission == permission) return true;
  }

  return false;
}

async function check_permission(object, permission) {
  if (!(await get_permission_state(object, permission)))
    throw new Error("Нет permission у пользователя");
}

fastify.post("/post/data", async (request, reply) => {
  try {
    checkProperty(request.body, "authorization");
    await check_login(request.body.authorization);
    await check_permission(request.body.authorization, "write");

    checkProperty(request.body, "data");
    checkProperty(request.body.data, "text");

    const client = new Client(autorization_settings);
    client.connect();

    let data = await client.query(
      'insert into data("time", "username", "is_edited", "text") values($1,$2,false,$3)',
      [new Date(), request.body.authorization.username, request.body.data.text]
    );
    client.end();

    return data.rows;
  } catch (err) {
    return err;
  }
});

fastify.post("/post/user", async (request, reply) => {
  try {
    checkProperty(request.body, "authorization");
    await check_login(request.body.authorization);
    await check_permission(request.body.authorization, "administrate");

    checkProperty(request.body, "data");
    checkProperty(request.body.data, "username");
    checkProperty(request.body.data, "password");
    checkProperty(request.body.data, "attributes");

    const client = new Client(autorization_settings);
    client.connect();

    const data = await client.query(
      'insert into users("username", "password", "attributes") values($1,$2,$3)',
      [
        request.body.data.username,
        await bcrypt.hash(request.body.data.password, 12),
        request.body.data.attributes,
      ]
    );
    client.end();

    return data.rows;
  } catch (err) {
    return err;
  }
});

fastify.post("/delete/data", async (request, reply) => {
  try {
    checkProperty(request.body, "authorization");
    await check_login(request.body.authorization);
    await check_permission(request.body.authorization, "write");

    checkProperty(request.body, "data");
    checkProperty(request.body.data, "id");

    const client = new Client(autorization_settings);
    client.connect();

    const data = await client.query("delete from data where id = $1", [
      request.body.data.id,
    ]);
    client.end();

    return data.rows;
  } catch (err) {
    return err;
  }
});

fastify.post("/delete/user", async (request, reply) => {
  try {
    checkProperty(request.body, "authorization");
    await check_login(request.body.authorization);
    await check_permission(request.body.authorization, "administrate");

    checkProperty(request.body, "data");
    checkProperty(request.body.data, "username");

    const client = new Client(autorization_settings);
    client.connect();

    const data = await client.query("delete from users where username = $1", [
      request.body.data.username,
    ]);
    client.end();

    return data.rows;
  } catch (err) {
    return err;
  }
});

fastify.post("/put/data", async (request, reply) => {
  try {
    checkProperty(request.body, "authorization");
    await check_login(request.body.authorization);
    await check_permission(request.body.authorization, "write");

    checkProperty(request.body, "data");
    checkProperty(request.body.data, "id");
    checkProperty(request.body.data, "text");

    const client = new Client(autorization_settings);
    client.connect();

    const data = await client.query(
      "update data set text = $1,is_edited = true where id = $2",
      [request.body.data.text, request.body.data.id]
    );
    client.end();

    return data.rows;
  } catch (err) {
    return err;
  }
});

fastify.post("/put/user/username", async (request, reply) => {
  try {
    checkProperty(request.body, "authorization");
    await check_login(request.body.authorization);

    checkProperty(request.body, "data");
    checkProperty(request.body.data, "username");

    const client = new Client(autorization_settings);
    client.connect();

    const data = await client.query(
      "update users set username = $1 where username = $2",
      [request.body.data.username, request.body.authorization.username]
    );
    client.end();

    return data.rows;
  } catch (err) {
    return err;
  }
});

fastify.post("/put/user/password", async (request, reply) => {
  try {
    checkProperty(request.body, "authorization");
    await check_login(request.body.authorization);

    checkProperty(request.body, "data");
    checkProperty(request.body.data, "password");

    const client = new Client(autorization_settings);
    client.connect();

    const data = await client.query(
      "update users set password = $1 where username = $2",
      [
        await bcrypt.hash(request.body.data.password, 12),
        request.body.authorization.username,
      ]
    );
    client.end();

    return data.rows;
  } catch (err) {
    return err;
  }
});

const start = async () => {
  try {
    await fastify.listen(3000);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
