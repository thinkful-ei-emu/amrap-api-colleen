BEGIN;

TRUNCATE
workouts,
amrap_users,
movements
RESTART IDENTITY CASCADE;

INSERT INTO movements (movement_name, body_part, equipment, reps)
VALUES
('bodyweight squats', 'legs', null, '10'),
('goblet squats', 'legs', 'dumbell', '10'),
('forearm plank', 'abs', null, '30 seconds'),
('bicycle crunches', 'abs', null, '25'),
('pushups', 'arms', null, '10'),
('shoulder press', 'shoulders', 'dumbell', '10'),
('burpees', 'full-body', null, '5'),
('single-leg deadlift', 'legs', 'dumbell', '10 each leg'),
('renegade rows', 'back', 'dumbell', '5 each arm'),
('kettlebell swings', 'butt', 'kettlebell', '15'),
('run', 'full-body', 'treadmill', '200 meters'),
('bike', 'legs', 'stationary bike', '800 meters'),
('fire hydrants', 'butt', null, '15 each side'),
('single leg bridges', 'butt', null, '10 each side'),
('side-lying straight leg raise', 'butt', null, '10 each side'),
('squat jumps', 'legs', null, '15'),
('overhead press', 'arms', 'barbell', '5'),
('back squat', 'legs', 'barbell', '10'),
('power clean', 'full-body', 'barbell', '5'),
('bent-over single arm row', 'back', 'dumbell', '8 each side');

INSERT INTO amrap_users (user_name, email, password)
VALUES
('bigbear123', '9thiagomarcolino1@kucinge.site', '$2y$12$Sg4eRYgo4whUbybMyrxmuOi7TTCkMan49U9kpIGm0QwHgQz/aimBa
'),
('sally', 'greembadr18v@jgfhho10-0-01.defaultdomain.ml', '$2y$12$lxtbRLnt/Wffqv2FnMPV7uYBGWD42KV2E3/08k2n9.ehOo4S7FROG
'),
('dunder-mifflin', 'sahmad.dh2014w@shn.luk2.com', '$2y$12$CjzPdx5N0jPjaXRjxlq7b.tRYUr1tbqbApo4O9hnPxM8acjuLuPXi
');

INSERT INTO workouts (user_id, workout_length)
VALUES
(1, 10),
(1, 20),
(2, 45),
(3, 13);

INSERT INTO workouts_movements (workout_id, movement_id)
VALUES
(1, 3),
(1, 1),
(1, 16),
(1, 5),
(2, 6),
(2, 5),
(2, 14),
(3, 2),
(3, 11),
(3, 12),
(4, 18),
(4, 7);

COMMIT;