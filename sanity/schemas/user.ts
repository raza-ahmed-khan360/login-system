export default {
  name: 'user',
  title: 'User',
  type: 'document',
  fields: [
    {
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule: any) => Rule.required().email(),
    },
    {
      name: 'password',
      title: 'Password',
      type: 'string',
    },
    {
      name: 'name',
      title: 'Name',
      type: 'string',
    },
    {
      name: 'image',
      title: 'Profile Image',
      type: 'url',
    },
    {
      name: 'provider',
      title: 'Auth Provider',
      type: 'string',
      options: {
        list: [
          { title: 'Email/Password', value: 'credentials' },
          { title: 'Google', value: 'google' },
          { title: 'Facebook', value: 'facebook' },
        ],
      },
    },
    {
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    },
  ],
  indexes: [
    {
      name: 'email',
      fields: ['email'],
      unique: true,
    },
  ],
} 