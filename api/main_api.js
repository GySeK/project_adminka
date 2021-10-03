"use strict"
const fastify = require('fastify')({ logger: true })
const bcrypt = require('bcryptjs')
const { Client } = require('pg')
const autorization_settings = {
  user: 'project_adminka',
  host: 'localhost',
  database: 'project_adminka',
  password: 'Gys35168',
  port: 5432,
}

fastify.post('/get/data', async (request, reply) => {
  try {
    const client = new Client(autorization_settings)
    client.connect()

    const data = await client.query('select * from data')
    client.end()

    if(data.rowCount == 0)
      throw new Error('table is empty')

    return data.rows
  } catch (err) {
    return err
  }
})

function checkProperty(object,property) {
  if(property in object == false) throw new Error(`Свойства ${property} нет в Объекте`)
}

async function get_login_state(object) {
  checkProperty(object, 'password')
  checkProperty(object, 'username')

  const client = new Client(autorization_settings)
  client.connect()

  let users_password = await client.query('select password from users where username = $1', [object.username])
  client.end()

  if(users_password.rowCount == 0)
    return false

  users_password = users_password.rows[0].password
  return await bcrypt.compare(object.password, users_password)
}

async function check_login(object) {
  if(!get_login_state(object)) throw new Error('permission denied')
}

fastify.post('/get/login_state', async (request, reply) => {
  try {
    checkProperty(request.body, 'authorization')
    return await get_login_state(request.body.authorization)
  } catch (err) {
    return err
  }
})

fastify.post('/post/data', async (request, reply) => {
  try {

    checkProperty(request.body, 'authorization')
    check_login(request.body.authorization)

    checkProperty(request.body, 'data')
    checkProperty(request.body.data, 'text')

    const client = new Client(autorization_settings)
    client.connect()

    const data = await client.query(
      'insert into data("time", "username", "is_edited", "text") values($1,$2,false,$3)',
      [new Date(), request.body.authorization.username, request.body.data.text])
    if(data.rowCount == 0)
      throw new Error('table is empty')
    client.end()

    return data.rows
  } catch (err) {
    return err
  }
})

fastify.post('/delete/data', async (request, reply) => {
  try {

    checkProperty(request.body, 'authorization')
    check_login(request.body.authorization)

    checkProperty(request.body, 'data')
    checkProperty(request.body.data, 'id')

    const client = new Client(autorization_settings)
    client.connect()

    const data = await client.query('delete from data where id = $1',[request.body.data.id])
    if(data.rowCount == 0)
      throw new Error('table is empty')
    client.end()

    return data.rows
  } catch (err) {
    return err
  }
})

const start = async () => {
  try {
    await fastify.listen(3000)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
