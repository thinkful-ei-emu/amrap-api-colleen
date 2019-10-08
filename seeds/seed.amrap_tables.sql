BEGIN;

TRUNCATE
workouts,
amrap_users,
movements,
workouts_movements
RESTART IDENTITY CASCADE;

INSERT INTO movements (movement_name, body_part, equipment, reps, video)
VALUES
('bodyweight squats', 'legs', null, '10', 'https://media.giphy.com/media/1qfKN8Dt0CRdCRxz9q/giphy.mp4'),
('goblet squats', 'legs', 'dumbell', '8', 'https://media.giphy.com/media/3oKIPvcdnW1xs9m5IA/giphy.mp4'),
('forearm plank', 'abs', null, '30 seconds', 'https://media.giphy.com/media/xT8qBff8cRRFf7k2u4/giphy.mp4'),
('bicycle crunches', 'abs', null, '10 each side', 'https://media.giphy.com/media/TMNCtgJGJnV8k/giphy.mp4'),
('pushups', 'arms', null, '10', 'https://media.giphy.com/media/5t9IcXiBCyw60XPpGu/giphy.mp4'),
('shoulder press', 'shoulders', 'dumbell', '5 each side', 'https://media.giphy.com/media/TKckWnMj2inrc06WtM/giphy.mp4'),
('burpees', 'full-body', null, '5', 'https://media.giphy.com/media/23hPPMRgPxbNBlPQe3/giphy.mp4'),
('single-leg deadlift', 'legs', 'dumbell', '5 each side', 'https://media.giphy.com/media/gJ39NLPCA3XMSFjN9R/giphy.mp4'),
('renegade rows', 'back', 'dumbell', '5 each side', 'https://media.giphy.com/media/1n6exUWUnxvyzkYAaG/giphy.mp4' ),
('kettlebell swings', 'butt', 'kettlebell', '10', 'https://media.giphy.com/media/3oEjHHYOTZeHjzLLOg/giphy.mp4'),
('run', 'full-body', 'treadmill', '100 meters', 'https://media.giphy.com/media/RIkE5DLnv62SF7SsgR/giphy.mp4'),
('run', 'full-body', 'treadmill', '400 meters', 'https://media.giphy.com/media/RIkE5DLnv62SF7SsgR/giphy.mp4'),
('run', 'full-body', 'treadmill', '1 minute', 'https://media.giphy.com/media/RIkE5DLnv62SF7SsgR/giphy.mp4'),
('run', 'full-body', 'treadmill', '5 minutes', 'https://media.giphy.com/media/RIkE5DLnv62SF7SsgR/giphy.mp4'),
('bike', 'legs', 'stationary-bike', '400 meters', 'https://media.giphy.com/media/YrfdIF8CRLEixgZnMY/giphy.mp4'),
('bike', 'legs', 'stationary-bike', '1 minute', 'https://media.giphy.com/media/YrfdIF8CRLEixgZnMY/giphy.mp4'),
('bike', 'legs', 'stationary-bike', '5 minutes', 'https://media.giphy.com/media/YrfdIF8CRLEixgZnMY/giphy.mp4'),
('bike', 'legs', 'stationary-bike', '1 mile', 'https://media.giphy.com/media/YrfdIF8CRLEixgZnMY/giphy.mp4'),
('fire hydrants', 'butt', null, '15 each leg', 'https://media.giphy.com/media/eMUUHU5xN0MOecSjXN/giphy.mp4'),
('single leg bridges', 'butt', null, '10 each leg', 'https://media.giphy.com/media/SJWtWnRFsTiNVSECVP/giphy.mp4'),
('side-lying straight leg raise', 'butt', null, '10 each leg', 'https://media.giphy.com/media/TGuHjbnTvt8KvKjAUE/giphy.mp4'),
('squat jumps', 'legs', null, '10', 'https://media.giphy.com/media/fnZyahMqyxJ4WcwKvC/giphy.mp4'),
('overhead press', 'arms', 'barbell', '5', 'https://media.giphy.com/media/1wmbkQCVu8Olnq4fmE/giphy.mp4'),
('back squat', 'legs', 'barbell', '5', 'https://media.giphy.com/media/fWw8YPmTRiZyvYLxR1/giphy.mp4'),
('power clean', 'full-body', 'barbell', '5', 'https://media.giphy.com/media/Ky5ZDiqkrA1MAMg3dm/giphy.mp4'),
('bent-over single arm row', 'back', 'dumbell', '6 each arm', 'https://media.giphy.com/media/Y1eDqueSb993UgGiIa/giphy.mp4'),
('banded side steps', 'legs', 'bands', '10 steps each side', 'https://media.giphy.com/media/gIOEsrDyg3uaRwdcps/giphy.mp4'),
('foot elevated split squat', 'legs', null, '10 each leg', 'https://media.giphy.com/media/q3zYQHwoZT7OM/giphy.mp4');

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