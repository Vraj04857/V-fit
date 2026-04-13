-- ============================================================
-- V2: Add muscle_group and equipment columns to exercise_library
-- and seed a comprehensive exercise database
-- ============================================================

-- Step 1: Add new columns
ALTER TABLE exercise_library ADD COLUMN IF NOT EXISTS muscle_group VARCHAR(50);
ALTER TABLE exercise_library ADD COLUMN IF NOT EXISTS equipment VARCHAR(100);

-- Step 2: Update existing exercises with muscle_group where possible
UPDATE exercise_library SET muscle_group = 'chest' WHERE LOWER(category) = 'strength' AND LOWER(exercise_name) LIKE '%bench%';
UPDATE exercise_library SET muscle_group = 'back' WHERE LOWER(category) = 'strength' AND LOWER(exercise_name) LIKE '%row%';
UPDATE exercise_library SET muscle_group = 'quads' WHERE LOWER(category) = 'strength' AND LOWER(exercise_name) LIKE '%squat%';

-- Step 3: Clear and re-seed with comprehensive exercise data
-- (Delete existing data to avoid duplicates — remove this line if you want to keep old data)
DELETE FROM exercise WHERE library_exercise_id IN (SELECT library_exercise_id FROM exercise_library);
DELETE FROM exercise_library;

-- ============================================================
-- CHEST EXERCISES
-- ============================================================
INSERT INTO exercise_library (exercise_name, category, muscle_group, difficulty_level, equipment, description, calories_burned_per_min, created_at) VALUES
('Barbell Bench Press', 'Strength', 'chest', 'INTERMEDIATE', 'Barbell, Bench', 'Lie flat on a bench and press a barbell upward from chest level.', 8, NOW()),
('Incline Dumbbell Press', 'Strength', 'chest', 'INTERMEDIATE', 'Dumbbells, Incline Bench', 'Press dumbbells upward on an incline bench to target upper chest.', 7, NOW()),
('Decline Bench Press', 'Strength', 'chest', 'INTERMEDIATE', 'Barbell, Decline Bench', 'Press a barbell on a decline bench to target lower chest.', 7, NOW()),
('Dumbbell Flyes', 'Strength', 'chest', 'BEGINNER', 'Dumbbells, Flat Bench', 'Lie flat and arc dumbbells outward and back together.', 5, NOW()),
('Cable Crossover', 'Strength', 'chest', 'INTERMEDIATE', 'Cable Machine', 'Pull cable handles from high to low in a hugging motion.', 5, NOW()),
('Push-Ups', 'Strength', 'chest', 'BEGINNER', 'Bodyweight', 'Classic bodyweight chest exercise performed face down.', 6, NOW()),
('Chest Dips', 'Strength', 'chest', 'ADVANCED', 'Dip Station', 'Lean forward on parallel bars and press your body upward.', 7, NOW()),
('Dumbbell Pullover', 'Strength', 'chest', 'INTERMEDIATE', 'Dumbbell, Bench', 'Lie perpendicular on a bench and arc a dumbbell overhead.', 5, NOW());

-- ============================================================
-- BACK EXERCISES
-- ============================================================
INSERT INTO exercise_library (exercise_name, category, muscle_group, difficulty_level, equipment, description, calories_burned_per_min, created_at) VALUES
('Conventional Deadlift', 'Strength', 'back', 'ADVANCED', 'Barbell', 'Lift a barbell from the floor to hip level using back and legs.', 10, NOW()),
('Pull-Ups', 'Strength', 'back', 'INTERMEDIATE', 'Pull-Up Bar', 'Hang from a bar and pull your body upward until chin is above the bar.', 8, NOW()),
('Barbell Bent-Over Row', 'Strength', 'back', 'INTERMEDIATE', 'Barbell', 'Bend at the hips and row a barbell to your lower chest.', 7, NOW()),
('Lat Pulldown', 'Strength', 'back', 'BEGINNER', 'Cable Machine', 'Pull a wide bar down to your chest while seated.', 6, NOW()),
('Seated Cable Row', 'Strength', 'back', 'BEGINNER', 'Cable Machine', 'Sit and pull a cable handle to your midsection.', 6, NOW()),
('T-Bar Row', 'Strength', 'back', 'INTERMEDIATE', 'T-Bar, Plates', 'Straddle a T-bar and row the weight to your chest.', 7, NOW()),
('Single-Arm Dumbbell Row', 'Strength', 'back', 'BEGINNER', 'Dumbbell, Bench', 'Row a dumbbell to your hip with one arm while braced on a bench.', 6, NOW()),
('Chin-Ups', 'Strength', 'back', 'INTERMEDIATE', 'Pull-Up Bar', 'Pull up with underhand grip to emphasize biceps and lower lats.', 8, NOW());

-- ============================================================
-- SHOULDERS EXERCISES
-- ============================================================
INSERT INTO exercise_library (exercise_name, category, muscle_group, difficulty_level, equipment, description, calories_burned_per_min, created_at) VALUES
('Overhead Press', 'Strength', 'shoulders', 'INTERMEDIATE', 'Barbell', 'Press a barbell overhead from shoulder height to full lockout.', 7, NOW()),
('Dumbbell Lateral Raise', 'Strength', 'shoulders', 'BEGINNER', 'Dumbbells', 'Raise dumbbells out to the sides until arms are parallel to the floor.', 4, NOW()),
('Front Raise', 'Strength', 'shoulders', 'BEGINNER', 'Dumbbells', 'Raise dumbbells in front of you to shoulder height.', 4, NOW()),
('Face Pulls', 'Strength', 'shoulders', 'BEGINNER', 'Cable Machine, Rope', 'Pull a rope attachment toward your face with elbows high.', 4, NOW()),
('Arnold Press', 'Strength', 'shoulders', 'INTERMEDIATE', 'Dumbbells', 'Rotate dumbbells from chin level to overhead press position.', 6, NOW()),
('Dumbbell Shoulder Press', 'Strength', 'shoulders', 'INTERMEDIATE', 'Dumbbells', 'Press dumbbells overhead from shoulder height while seated or standing.', 6, NOW()),
('Reverse Pec Deck', 'Strength', 'shoulders', 'BEGINNER', 'Machine', 'Sit facing the machine and push handles backward to target rear delts.', 4, NOW()),
('Upright Row', 'Strength', 'shoulders', 'INTERMEDIATE', 'Barbell', 'Pull a barbell upward along your body to chin height.', 5, NOW());

-- ============================================================
-- BICEPS EXERCISES
-- ============================================================
INSERT INTO exercise_library (exercise_name, category, muscle_group, difficulty_level, equipment, description, calories_burned_per_min, created_at) VALUES
('Barbell Curl', 'Strength', 'biceps', 'BEGINNER', 'Barbell', 'Curl a barbell from hip level to shoulder height.', 5, NOW()),
('Dumbbell Hammer Curl', 'Strength', 'biceps', 'BEGINNER', 'Dumbbells', 'Curl dumbbells with neutral grip to target brachialis.', 4, NOW()),
('Incline Dumbbell Curl', 'Strength', 'biceps', 'INTERMEDIATE', 'Dumbbells, Incline Bench', 'Curl dumbbells while seated on an incline bench for a deep stretch.', 5, NOW()),
('Preacher Curl', 'Strength', 'biceps', 'INTERMEDIATE', 'EZ Bar, Preacher Bench', 'Curl a bar with arms braced on a preacher bench.', 5, NOW()),
('Concentration Curl', 'Strength', 'biceps', 'BEGINNER', 'Dumbbell', 'Curl with elbow braced against inner thigh for isolation.', 4, NOW()),
('Cable Curl', 'Strength', 'biceps', 'BEGINNER', 'Cable Machine', 'Curl a cable bar from low pulley for constant tension.', 4, NOW());

-- ============================================================
-- TRICEPS EXERCISES
-- ============================================================
INSERT INTO exercise_library (exercise_name, category, muscle_group, difficulty_level, equipment, description, calories_burned_per_min, created_at) VALUES
('Tricep Pushdown', 'Strength', 'triceps', 'BEGINNER', 'Cable Machine', 'Push a cable bar downward from chest to hip using triceps.', 4, NOW()),
('Skull Crushers', 'Strength', 'triceps', 'INTERMEDIATE', 'EZ Bar, Flat Bench', 'Lower an EZ bar to your forehead while lying on a bench.', 5, NOW()),
('Overhead Tricep Extension', 'Strength', 'triceps', 'BEGINNER', 'Dumbbell', 'Extend a dumbbell overhead with both hands behind your head.', 4, NOW()),
('Close-Grip Bench Press', 'Strength', 'triceps', 'INTERMEDIATE', 'Barbell, Bench', 'Bench press with a narrow grip to emphasize triceps.', 7, NOW()),
('Diamond Push-Ups', 'Strength', 'triceps', 'INTERMEDIATE', 'Bodyweight', 'Push-ups with hands close together forming a diamond shape.', 6, NOW()),
('Tricep Kickback', 'Strength', 'triceps', 'BEGINNER', 'Dumbbell', 'Bend forward and extend a dumbbell backward using triceps.', 4, NOW());

-- ============================================================
-- ABS / CORE EXERCISES
-- ============================================================
INSERT INTO exercise_library (exercise_name, category, muscle_group, difficulty_level, equipment, description, calories_burned_per_min, created_at) VALUES
('Crunches', 'Strength', 'abs', 'BEGINNER', 'Bodyweight', 'Lie on your back and curl your torso toward your knees.', 5, NOW()),
('Plank', 'Strength', 'abs', 'BEGINNER', 'Bodyweight', 'Hold a push-up position with forearms on the ground.', 4, NOW()),
('Hanging Leg Raise', 'Strength', 'abs', 'ADVANCED', 'Pull-Up Bar', 'Hang from a bar and raise your legs to horizontal or above.', 6, NOW()),
('Russian Twist', 'Strength', 'abs', 'INTERMEDIATE', 'Bodyweight', 'Sit with knees bent and rotate your torso side to side.', 5, NOW()),
('Cable Woodchop', 'Strength', 'abs', 'INTERMEDIATE', 'Cable Machine', 'Pull a cable from high to low in a diagonal chopping motion.', 5, NOW()),
('Ab Wheel Rollout', 'Strength', 'abs', 'ADVANCED', 'Ab Wheel', 'Kneel and roll an ab wheel forward then return to start.', 7, NOW()),
('Bicycle Crunch', 'Strength', 'abs', 'BEGINNER', 'Bodyweight', 'Alternate touching elbows to opposite knees in a pedaling motion.', 5, NOW()),
('Mountain Climbers', 'Cardio', 'abs', 'BEGINNER', 'Bodyweight', 'In a push-up position, drive knees alternately toward chest.', 8, NOW());

-- ============================================================
-- QUADS / FRONT LEGS
-- ============================================================
INSERT INTO exercise_library (exercise_name, category, muscle_group, difficulty_level, equipment, description, calories_burned_per_min, created_at) VALUES
('Barbell Back Squat', 'Strength', 'quads', 'INTERMEDIATE', 'Barbell, Squat Rack', 'Place a barbell on your back and squat below parallel.', 10, NOW()),
('Front Squat', 'Strength', 'quads', 'ADVANCED', 'Barbell, Squat Rack', 'Hold a barbell in front rack position and squat deep.', 9, NOW()),
('Leg Press', 'Strength', 'quads', 'BEGINNER', 'Leg Press Machine', 'Push a weighted sled away using your legs.', 8, NOW()),
('Leg Extension', 'Strength', 'quads', 'BEGINNER', 'Leg Extension Machine', 'Extend your legs against resistance while seated.', 5, NOW()),
('Bulgarian Split Squat', 'Strength', 'quads', 'INTERMEDIATE', 'Dumbbells, Bench', 'Lunge with rear foot elevated on a bench.', 7, NOW()),
('Walking Lunges', 'Strength', 'quads', 'BEGINNER', 'Dumbbells', 'Step forward into a lunge and alternate legs while walking.', 7, NOW()),
('Goblet Squat', 'Strength', 'quads', 'BEGINNER', 'Dumbbell or Kettlebell', 'Hold a weight at your chest and squat to depth.', 7, NOW()),
('Hack Squat', 'Strength', 'quads', 'INTERMEDIATE', 'Hack Squat Machine', 'Squat on a hack squat machine with back against the pad.', 8, NOW());

-- ============================================================
-- HAMSTRINGS
-- ============================================================
INSERT INTO exercise_library (exercise_name, category, muscle_group, difficulty_level, equipment, description, calories_burned_per_min, created_at) VALUES
('Romanian Deadlift', 'Strength', 'hamstrings', 'INTERMEDIATE', 'Barbell', 'Hinge at the hips with a barbell while keeping legs nearly straight.', 8, NOW()),
('Lying Leg Curl', 'Strength', 'hamstrings', 'BEGINNER', 'Leg Curl Machine', 'Curl the weight toward your glutes while lying face down.', 5, NOW()),
('Seated Leg Curl', 'Strength', 'hamstrings', 'BEGINNER', 'Seated Leg Curl Machine', 'Curl the pad under the seat using your hamstrings.', 5, NOW()),
('Nordic Hamstring Curl', 'Strength', 'hamstrings', 'ADVANCED', 'Bodyweight', 'Kneel and slowly lower your body forward using hamstring control.', 7, NOW()),
('Good Morning', 'Strength', 'hamstrings', 'INTERMEDIATE', 'Barbell', 'Hinge forward at the hips with a barbell on your back.', 6, NOW()),
('Stiff-Leg Deadlift', 'Strength', 'hamstrings', 'INTERMEDIATE', 'Dumbbells', 'Deadlift with minimal knee bend to isolate hamstrings.', 7, NOW());

-- ============================================================
-- GLUTES
-- ============================================================
INSERT INTO exercise_library (exercise_name, category, muscle_group, difficulty_level, equipment, description, calories_burned_per_min, created_at) VALUES
('Barbell Hip Thrust', 'Strength', 'glutes', 'INTERMEDIATE', 'Barbell, Bench', 'Drive a barbell upward by extending hips while upper back is on a bench.', 8, NOW()),
('Glute Bridge', 'Strength', 'glutes', 'BEGINNER', 'Bodyweight', 'Lie on your back and lift hips to the ceiling squeezing glutes.', 5, NOW()),
('Cable Kickback', 'Strength', 'glutes', 'BEGINNER', 'Cable Machine, Ankle Strap', 'Kick one leg backward against cable resistance.', 4, NOW()),
('Sumo Deadlift', 'Strength', 'glutes', 'INTERMEDIATE', 'Barbell', 'Deadlift with a wide stance to emphasize glutes and inner thighs.', 9, NOW()),
('Step-Ups', 'Strength', 'glutes', 'BEGINNER', 'Box, Dumbbells', 'Step onto a box one leg at a time holding dumbbells.', 6, NOW()),
('Donkey Kick', 'Strength', 'glutes', 'BEGINNER', 'Bodyweight', 'On all fours, drive one leg upward toward the ceiling.', 4, NOW());

-- ============================================================
-- CALVES
-- ============================================================
INSERT INTO exercise_library (exercise_name, category, muscle_group, difficulty_level, equipment, description, calories_burned_per_min, created_at) VALUES
('Standing Calf Raise', 'Strength', 'calves', 'BEGINNER', 'Calf Raise Machine', 'Rise onto your toes with weight on your shoulders.', 4, NOW()),
('Seated Calf Raise', 'Strength', 'calves', 'BEGINNER', 'Seated Calf Machine', 'Rise onto toes while seated with weight on your knees.', 3, NOW()),
('Single-Leg Calf Raise', 'Strength', 'calves', 'BEGINNER', 'Bodyweight', 'Balance on one leg and raise your heel off the ground.', 3, NOW()),
('Donkey Calf Raise', 'Strength', 'calves', 'INTERMEDIATE', 'Machine or Partner', 'Bend at the hips and raise your heels with weight on your back.', 4, NOW());

-- ============================================================
-- TRAPS
-- ============================================================
INSERT INTO exercise_library (exercise_name, category, muscle_group, difficulty_level, equipment, description, calories_burned_per_min, created_at) VALUES
('Barbell Shrug', 'Strength', 'traps', 'BEGINNER', 'Barbell', 'Hold a barbell at hip level and shrug your shoulders upward.', 4, NOW()),
('Dumbbell Shrug', 'Strength', 'traps', 'BEGINNER', 'Dumbbells', 'Hold dumbbells at your sides and shrug shoulders to ears.', 4, NOW()),
('Farmer Walk', 'Strength', 'traps', 'INTERMEDIATE', 'Heavy Dumbbells or Farmer Handles', 'Walk with heavy weights in each hand maintaining posture.', 6, NOW()),
('Rack Pulls', 'Strength', 'traps', 'INTERMEDIATE', 'Barbell, Squat Rack', 'Deadlift from knee height to lockout to overload traps.', 7, NOW());

-- ============================================================
-- LOWER BACK
-- ============================================================
INSERT INTO exercise_library (exercise_name, category, muscle_group, difficulty_level, equipment, description, calories_burned_per_min, created_at) VALUES
('Back Extension', 'Strength', 'lowerback', 'BEGINNER', 'Roman Chair', 'Hinge over a roman chair and extend your torso upward.', 5, NOW()),
('Superman Hold', 'Strength', 'lowerback', 'BEGINNER', 'Bodyweight', 'Lie face down and lift arms and legs off the ground simultaneously.', 4, NOW()),
('Reverse Hyperextension', 'Strength', 'lowerback', 'INTERMEDIATE', 'Reverse Hyper Machine', 'Swing your legs upward while lying face down on a platform.', 5, NOW()),
('Bird Dog', 'Strength', 'lowerback', 'BEGINNER', 'Bodyweight', 'On all fours, extend opposite arm and leg while maintaining balance.', 3, NOW());

-- ============================================================
-- CARDIO EXERCISES (muscle_group = 'cardio')
-- ============================================================
INSERT INTO exercise_library (exercise_name, category, muscle_group, difficulty_level, equipment, description, calories_burned_per_min, created_at) VALUES
('Running (Treadmill)', 'Cardio', 'cardio', 'BEGINNER', 'Treadmill', 'Steady-state running on a treadmill at moderate pace.', 10, NOW()),
('Jump Rope', 'Cardio', 'cardio', 'BEGINNER', 'Jump Rope', 'Skip rope at a steady pace for cardiovascular endurance.', 12, NOW()),
('Burpees', 'Cardio', 'cardio', 'INTERMEDIATE', 'Bodyweight', 'Squat, kick back to plank, do a push-up, jump up, repeat.', 10, NOW()),
('Rowing Machine', 'Cardio', 'cardio', 'BEGINNER', 'Rowing Machine', 'Row on an ergometer for full-body cardiovascular training.', 9, NOW()),
('Cycling (Stationary)', 'Cardio', 'cardio', 'BEGINNER', 'Stationary Bike', 'Pedal a stationary bike at moderate to high intensity.', 8, NOW()),
('Box Jumps', 'Cardio', 'cardio', 'INTERMEDIATE', 'Plyo Box', 'Jump onto a raised box and step or jump back down.', 9, NOW());