export default {
    name: 'user',
    type: 'document',
    title: 'User',
    fields: [
      {
        name: 'email',
        type: 'string',
        title: 'Email',
        validation: (Rule : any) => Rule.required().email(),
      },
      {
        name: 'password',
        type: 'string',
        title: 'Password',
        description: 'Hashed password',
        hidden: true,
      },
      {
        name: 'createdAt',
        type: 'datetime',
        title: 'Created At',
        initialValue: () => new Date().toISOString(),
      },
    ],
  };
  