export const StackData = {
  stack: {
    lambda: [
      {
        name: "getUsers",
        runtime: "NODEJS_14_X",
        handler: "getUsers.handler",
        gateway: "restApi",
        method: "GET",
        path: "users",
        permissions: [
          {
            tableName: "users",
            grant: "R",
          },
        ],
      },
      {
        name: "postUser",
        runtime: "NODEJS_14_X",
        handler: "postUser.handler",
        gateway: "restApi",
        method: "POST",
        path: "users",
        permissions: [
          {
            tableName: "users",
            grant: "RW",
          },
        ],
      },
      {
        name: "getUser",
        runtime: "NODEJS_14_X",
        handler: "getUser.handler",
        gateway: "restApi",
        method: "GET",
        path: "users/{id}",
        permissions: [
          {
            tableName: "users",
            grant: "R",
          },
        ],
      },
      {
        name: "updateUser",
        runtime: "NODEJS_14_X",
        handler: "updateUser.handler",
        gateway: "restApi",
        method: "PATCH",
        path: "users/{id}",
        permissions: [
          {
            tableName: "users",
            grant: "RW",
          },
        ],
      },
      {
        name: "deleteUser",
        runtime: "NODEJS_14_X",
        handler: "deleteUser.handler",
        gateway: "restApi",
        method: "DELETE",
        path: "users/{id}",
        permissions: [
          {
            tableName: "users",
            grant: "RW",
          },
        ],
      },
    ],
    dynamo: [
      {
        name: "usersTable",
        tableName: "users",
        partitionKey: {
          name: "id",
          type: "STRING",
        },
      },
    ],
    gateway: [
      {
        name: "restApi",
        deployOptions: {
          metricsEnabled: true,
          loggingLevel: "INFO",
          dataTraceEnabled: true,
        },
        cloudWatchRole: true,
      },
    ],
  },
};
