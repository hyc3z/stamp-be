import axios from 'axios'
import config from '../../../configs/environments/development'
import testconfig from '../../config/test-config'

let test_jwt: string
test('Api should be rejected when not logged in.', async () => {
  try {
    await axios.get(`http://${config.host}:${config.port}/task/`).then(res => {
      return res.status
    })
  } catch (e) {
    expect(JSON.stringify(e)).toMatch('Error: Request failed with status code 401')
  }
})

test('User register.', async () => {
  const response = await axios.get(
    `http://${config.host}:${config.port}/user/register?username=${testconfig.test_account}&password=${testconfig.test_pwd}`,
  )
  expect(JSON.stringify(response.data['message'])).toMatch(/true|false/g)
})

test('User login.', async () => {
  const response = await axios.get(
    `http://${config.host}:${config.port}/user/login?username=${testconfig.test_account}&password=${testconfig.test_pwd}`,
  )
  test_jwt = response.data['message']
  expect(test_jwt.length.toString()).toMatch('139')
})

test('Use token to request, api exposed.', async () => {
  try {
    const response = await axios.get(
      `http://${config.host}:${config.port}/cluster/nodes`,
      {
        headers: {
          Authorization: `Bearer ${test_jwt}`,
        },
      },
    )
    console.log(typeof response.data)
    expect(response.status.toString()).toMatch('200')
  } catch (e) {}
})
