-- Up Migration

DROP TYPE IF EXISTS stakeholder_role;
DROP TYPE IF EXISTS ticket_category;

CREATE TYPE stakeholder_role AS ENUM ('director', 'member', 'cosec');

CREATE TYPE ticket_category AS ENUM ('corpsec', 'accounting');

CREATE TABLE entity (
  id SERIAL PRIMARY KEY,
  uen VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  created_by VARCHAR(255),
  updated_by VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE subject_matter (
  id SERIAL PRIMARY KEY,
  entity_id INTEGER REFERENCES entity(id) NOT NULL,
  type VARCHAR(255) NOT NULL
);

CREATE TABLE stakeholders (
  id SERIAL PRIMARY KEY,
  role stakeholder_role NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  entity_id INTEGER REFERENCES entity(id) NOT NULL,
  created_by VARCHAR(255),
  updated_by VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tickets (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category ticket_category NOT NULL
);

CREATE TABLE staff (
  id SERIAL PRIMARY KEY,
  upn VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,  
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(255),
  position VARCHAR(255),
  department VARCHAR(255)
);

CREATE TABLE user_tickets (
  id SERIAL PRIMARY KEY,
  ticket_id INTEGER REFERENCES tickets(id) NOT NULL,
  response JSONB,
  priority VARCHAR(255) NOT NULL,
  recipient INTEGER REFERENCES entity(id) NOT NULL,
  reporter INTEGER REFERENCES staff(id),
  assignee INTEGER REFERENCES staff,
  additional_details TEXT,
  created_by VARCHAR(255),
  updated_by VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deadline TIMESTAMP WITH TIME ZONE
);

CREATE TABLE ticket_form_fields (
  id SERIAL PRIMARY KEY,
  ticket_id INTEGER REFERENCES tickets(id) NOT NULL,
  label VARCHAR(255) NOT NULL,
  data TEXT[],
  is_required BOOLEAN NOT NULL DEFAULT FALSE,
  constraints JSONB,
  created_by VARCHAR(255),
  updated_by VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE files (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(255),
  url VARCHAR(255),
  ticket_id INTEGER REFERENCES tickets(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "session" (
  "sid" VARCHAR NOT NULL COLLATE "default",
  "sess" JSON NOT NULL,
  "expire" TIMESTAMP(6) NOT NULL,
  PRIMARY KEY ("sid")
);

-- Down Migration