import prompts from 'prompts'

const getMenuChoice = async () => {
  const choices: any[] = [
    {
      value: 'Library',
      description: 'Search for and reserve books',
    },
    {
      value: 'Account',
      description: 'Manage your reservations',
    },
    {
      value: 'Exit',
      description: 'Close the application',
    },
  ]
  const { value } = await prompts({
    type: 'select',
    name: 'value',
    message: 'Pick a choice',
    choices,
  })
  return value
}

export default getMenuChoice
