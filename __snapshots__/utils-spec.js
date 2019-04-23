exports['utils getArguments handles 3 arguments with http-get url 1'] = {
  "start": "start",
  "url": [
    "http-get://localhost:8080"
  ],
  "test": "test"
}

exports['utils getArguments returns 3 arguments 1'] = {
  "start": "start",
  "url": [
    "http://localhost:8080"
  ],
  "test": "test"
}

exports['utils getArguments returns 3 arguments with url 1'] = {
  "start": "start",
  "url": [
    "http://localhost:8080"
  ],
  "test": "test"
}

exports['utils getArguments understands several ports 1'] = {
  "start": "start",
  "url": [
    "http://localhost:3000",
    "http://localhost:4000",
    "http://localhost:5000"
  ],
  "test": "test"
}

exports['utils getArguments understands single :port 1'] = {
  "start": "start",
  "url": [
    "http://localhost:3000"
  ],
  "test": "test"
}

exports['utils getArguments understands single port 1'] = {
  "start": "start",
  "url": [
    "http://localhost:3000"
  ],
  "test": "test"
}

exports['utils getArguments understands start plus url 1'] = {
  "start": "start-server",
  "url": [
    "http://localhost:6000"
  ],
  "test": "test"
}

exports['utils getArguments understands url plus test 1'] = {
  "start": "start",
  "url": [
    "http://localhost:6000"
  ],
  "test": "test"
}
