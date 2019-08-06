CREATE TYPE part AS ENUM ('legs', 'shoulders', 'butt', 'arms', 'back', 'abs', 'full-body');

CREATE TABLE movements (
  id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
  movement_name TEXT NOT NULL,
  body_part part NOT NULL,
  equipment TEXT,
  reps TEXT NOT NULL
);