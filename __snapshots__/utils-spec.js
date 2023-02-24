exports['utils crossArguments concates arguments if wrapped by " 1'] = [
  "start",
  "8080",
  "test argument --option"
]

exports['utils crossArguments concates arguments if wrapped by \' 1'] = [
  "start",
  "8080",
  "test argument --option"
]

exports['utils crossArguments concates arguments if wrapped by ` 1'] = [
  "start",
  "8080",
  "test argument --option"
]

exports['utils crossArguments ignores end char (") if not at the end of an argument 1'] = [
  "start",
  "8080",
  "test argu\"ment --option"
]

exports['utils crossArguments ignores end char (\') if not at the end of an argument 1'] = [
  "start",
  "8080",
  "test argu'ment --option"
]

exports['utils crossArguments ignores end char (`) if not at the end of an argument 1'] = [
  "start",
  "8080",
  "test argu`ment --option"
]

exports['utils crossArguments ignores end chars that are != the startChar of an argument 1'] = [
  "start",
  "8080",
  "test argument' --option"
]

exports['utils getArguments allows 5 arguments 1'] = {
  "args": [
    "start",
    "6000",
    "start:web",
    "6010",
    "test"
  ],
  "parsed": {
    "services": [
      {
        "start": "npm run start",
        "url": [
          "http://127.0.0.1:6000"
        ]
      },
      {
        "start": "start:web",
        "url": [
          "http://127.0.0.1:6010"
        ]
      }
    ],
    "test": "npm run test"
  }
}

exports['utils getArguments determines NPM script for each command 1'] = {
  "args": [
    "startA",
    "6000",
    "startB",
    "6010",
    "testC"
  ],
  "parsed": {
    "services": [
      {
        "start": "npm run startA",
        "url": [
          "http://127.0.0.1:6000"
        ]
      },
      {
        "start": "npm run startB",
        "url": [
          "http://127.0.0.1:6010"
        ]
      }
    ],
    "test": "npm run testC"
  }
}

exports['utils getArguments handles 3 arguments with http-get url 1'] = {
  "services": [
    {
      "start": "npm run start",
      "url": [
        "http-get://localhost:8080"
      ]
    }
  ],
  "test": "npm run test"
}

exports['utils getArguments returns 3 arguments 1'] = {
  "args": [
    "start",
    "8080",
    "test"
  ],
  "parsed": {
    "services": [
      {
        "start": "npm run start",
        "url": [
          "http://127.0.0.1:8080"
        ]
      }
    ],
    "test": "npm run test"
  }
}

exports['utils getArguments returns 3 arguments with url 1'] = {
  "services": [
    {
      "start": "npm run start",
      "url": [
        "http://localhost:8080"
      ]
    }
  ],
  "test": "npm run test"
}

exports['utils getArguments understands custom commands 1'] = {
  "services": [
    {
      "start": "custom-command --with argument",
      "url": [
        "http://127.0.0.1:3000"
      ]
    }
  ],
  "test": "test-command --x=1"
}

exports['utils getArguments understands several ports 1'] = {
  "services": [
    {
      "start": "npm run start",
      "url": [
        "http://127.0.0.1:3000",
        "http://127.0.0.1:4000",
        "http://127.0.0.1:5000"
      ]
    }
  ],
  "test": "npm run test"
}

exports['utils getArguments understands single :port 1'] = {
  "services": [
    {
      "start": "npm run start",
      "url": [
        "http://127.0.0.1:3000"
      ]
    }
  ],
  "test": "npm run test"
}

exports['utils getArguments understands single port 1'] = {
  "services": [
    {
      "start": "npm run start",
      "url": [
        "http://127.0.0.1:3000"
      ]
    }
  ],
  "test": "npm run test"
}

exports['utils getArguments understands start plus url 1'] = {
  "services": [
    {
      "start": "start-server",
      "url": [
        "http://127.0.0.1:6000"
      ]
    }
  ],
  "test": "npm run test"
}

exports['utils getArguments understands url plus test 1'] = {
  "services": [
    {
      "start": "npm run start",
      "url": [
        "http://127.0.0.1:6000"
      ]
    }
  ],
  "test": "npm run test"
}
