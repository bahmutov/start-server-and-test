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
          "http://localhost:6000"
        ]
      }
    ],
    "test": "npm run test"
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
          "http://localhost:8080"
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
        "http://localhost:3000"
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
        "http://localhost:3000",
        "http://localhost:4000",
        "http://localhost:5000"
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
        "http://localhost:3000"
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
        "http://localhost:3000"
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
        "http://localhost:6000"
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
        "http://localhost:6000"
      ]
    }
  ],
  "test": "npm run test"
}
