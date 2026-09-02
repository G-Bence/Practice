import './style.css'
import type { Users } from './UsersInterfaces.ts'


const API_URL = "https://retoolapi.dev/rdieG6/data"

async function fetchData() {
  const response = await fetch(API_URL)
  const data = await response.json()
  console.log(data)
  const users: Users[] = data.map((user: any) => ({
    name: user.name,
    startDate: new Date(user.startDate),
    signUps: user.signUps,
    optinalOne: user.optinalOne
  }))
  console.log(users)
  return users
}

function createTableRow(users: Users[]) {
  let i = 0
  users.map((user) => {
    const row = document.createElement('tr')

    const nameCell = row.appendChild(document.createElement('td'))
    const startDateCell = row.appendChild(document.createElement('td'))
    const signUpsCell = row.appendChild(document.createElement('td'))
    const optinalOneCell = row.appendChild(document.createElement('td'))
    const deleteCell = row.appendChild(document.createElement('td'))
    const deleteButton = document.createElement('button')
    deleteButton.textContent = 'Delete'
    deleteButton.classList.add('btn', 'btn-danger')
    deleteButton.addEventListener('click', async () => {
      try {
        const response = await fetch(`${API_URL}/${i}`, {
          method: 'DELETE'
        })
        if (!response.ok) {
          throw new Error(`ERROR: ${response.status}`)
        }
        
        const newData = await fetchData()
        usersTable!.innerHTML = ''
        createTableRow(newData)

      } catch (error) {
        console.error('Error deleting user:', error)
      }
    })
    deleteCell.appendChild(deleteButton)



    nameCell.textContent = user.name ? user.name : (nameCell.classList.add('bg-danger'), 'No name provided')
    startDateCell.textContent = user.startDate.toDateString() ? user.startDate.toDateString() : (startDateCell.classList.add('bg-danger'), 'No start date provided')
    signUpsCell.textContent = user.signUps.toString() ? user.signUps.toString() : (signUpsCell.classList.add('bg-danger'), 'No sign ups provided')
    optinalOneCell.textContent = user.optinalOne ? user.optinalOne : (optinalOneCell.classList.add('bg-danger'), 'No optional one provided')

    usersTable?.appendChild(row)
    i++
  })
}


const usersTable = document.getElementById('users-table-body')
const users: Users[] = await fetchData()
createTableRow(users)


document.getElementById("user-form")?.addEventListener("submit", async (event) => {
  event.preventDefault()

  const nameInput = document.getElementById("name") as HTMLInputElement
  const startDateInput = document.getElementById("start-date") as HTMLInputElement
  const signUpsInput = document.getElementById("sign-ups") as HTMLInputElement
  const optinalOneInput = document.getElementById("optional-one") as HTMLInputElement

  const newUser: Users = {
    name: nameInput.value,
    startDate: startDateInput.valueAsDate || new Date(),
    signUps: parseInt(signUpsInput.value),
    optinalOne: optinalOneInput.value
  }

  console.log("New user:", newUser)


  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newUser)
    })

    if (!response.ok) {
      throw new Error(`ERROR: ${response.status}`)
    }

   const newData = await fetchData()
    usersTable!.innerHTML = ""
    createTableRow(newData)

    nameInput.value = ""
    startDateInput.value = ""
    signUpsInput.value = ""
    optinalOneInput.value = ""

  } catch (error) {
    console.error("Error creating user:", error)
  }
})