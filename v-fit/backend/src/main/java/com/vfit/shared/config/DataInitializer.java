package com.vfit.shared.config;

import com.vfit.modules.diet.entity.FoodLibrary;
import com.vfit.modules.diet.repository.FoodLibraryRepository;
import com.vfit.modules.workout.entity.ExerciseLibrary;
import com.vfit.modules.workout.repository.ExerciseLibraryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private ExerciseLibraryRepository exerciseLibraryRepository;

    @Autowired
    private FoodLibraryRepository foodLibraryRepository;

    @Override
    public void run(String... args) {
        initializeExercises();
        initializeFoods();
    }

    private void initializeExercises() {
        if (exerciseLibraryRepository.count() > 0) {
            System.out.println("Exercise library already populated ("
                    + exerciseLibraryRepository.count() + " exercises) — skipping seed.");
            return;
        }

        List<ExerciseLibrary> ex = new ArrayList<>();

        // ── CHEST ─────────────────────────────────────────────────────────
        ex.add(e("Barbell Bench Press",      "Strength","chest",      "INTERMEDIATE","Barbell, Bench",          "Lie flat on bench and press barbell from chest to lockout.", 8));
        ex.add(e("Incline Dumbbell Press",   "Strength","chest",      "INTERMEDIATE","Dumbbells, Incline Bench","Press dumbbells upward on incline bench — targets upper chest.", 7));
        ex.add(e("Decline Bench Press",      "Strength","chest",      "INTERMEDIATE","Barbell, Decline Bench",  "Press barbell on decline bench — targets lower chest.", 7));
        ex.add(e("Dumbbell Flyes",           "Strength","chest",      "BEGINNER",    "Dumbbells, Flat Bench",   "Lie flat and arc dumbbells outward and back together.", 5));
        ex.add(e("Cable Crossover",          "Strength","chest",      "INTERMEDIATE","Cable Machine",           "Pull cable handles from high to low in a hugging motion.", 5));
        ex.add(e("Push-Ups",                 "Strength","chest",      "BEGINNER",    "Bodyweight",              "Classic bodyweight chest exercise performed face down.", 6));
        ex.add(e("Chest Dips",               "Strength","chest",      "ADVANCED",    "Dip Station",             "Lean forward on parallel bars and press body upward.", 7));
        ex.add(e("Dumbbell Pullover",        "Strength","chest",      "INTERMEDIATE","Dumbbell, Bench",         "Lie perpendicular on bench and arc dumbbell overhead.", 5));

        // ── BACK ──────────────────────────────────────────────────────────
        ex.add(e("Conventional Deadlift",    "Strength","back",       "ADVANCED",    "Barbell",                 "Lift barbell from floor to hip level using back and legs.", 10));
        ex.add(e("Pull-Ups",                 "Strength","back",       "INTERMEDIATE","Pull-Up Bar",             "Hang from bar and pull body up until chin clears the bar.", 8));
        ex.add(e("Barbell Bent-Over Row",    "Strength","back",       "INTERMEDIATE","Barbell",                 "Bend at hips and row barbell to lower chest.", 7));
        ex.add(e("Lat Pulldown",             "Strength","back",       "BEGINNER",    "Cable Machine",           "Pull wide bar down to chest while seated.", 6));
        ex.add(e("Seated Cable Row",         "Strength","back",       "BEGINNER",    "Cable Machine",           "Sit and pull cable handle to midsection.", 6));
        ex.add(e("T-Bar Row",                "Strength","back",       "INTERMEDIATE","T-Bar, Plates",           "Straddle T-bar and row weight to chest.", 7));
        ex.add(e("Single-Arm Dumbbell Row",  "Strength","back",       "BEGINNER",    "Dumbbell, Bench",         "Row dumbbell to hip with one arm while braced on bench.", 6));
        ex.add(e("Chin-Ups",                 "Strength","back",       "INTERMEDIATE","Pull-Up Bar",             "Pull up with underhand grip — emphasises biceps and lower lats.", 8));

        // ── SHOULDERS ─────────────────────────────────────────────────────
        ex.add(e("Overhead Press",           "Strength","shoulders",  "INTERMEDIATE","Barbell",                 "Press barbell overhead from shoulder height to lockout.", 7));
        ex.add(e("Dumbbell Lateral Raise",   "Strength","shoulders",  "BEGINNER",    "Dumbbells",               "Raise dumbbells to sides until arms are parallel to floor.", 4));
        ex.add(e("Front Raise",              "Strength","shoulders",  "BEGINNER",    "Dumbbells",               "Raise dumbbells in front to shoulder height.", 4));
        ex.add(e("Face Pulls",               "Strength","shoulders",  "BEGINNER",    "Cable Machine, Rope",     "Pull rope attachment toward face with elbows high.", 4));
        ex.add(e("Arnold Press",             "Strength","shoulders",  "INTERMEDIATE","Dumbbells",               "Rotate dumbbells from chin level to overhead press position.", 6));
        ex.add(e("Dumbbell Shoulder Press",  "Strength","shoulders",  "INTERMEDIATE","Dumbbells",               "Press dumbbells overhead from shoulder height.", 6));
        ex.add(e("Reverse Pec Deck",         "Strength","shoulders",  "BEGINNER",    "Machine",                 "Sit facing machine and push handles backward for rear delts.", 4));
        ex.add(e("Upright Row",              "Strength","shoulders",  "INTERMEDIATE","Barbell",                 "Pull barbell upward along body to chin height.", 5));

        // ── BICEPS ────────────────────────────────────────────────────────
        ex.add(e("Barbell Curl",             "Strength","biceps",     "BEGINNER",    "Barbell",                 "Curl barbell from hip level to shoulder height.", 5));
        ex.add(e("Dumbbell Hammer Curl",     "Strength","biceps",     "BEGINNER",    "Dumbbells",               "Curl dumbbells with neutral grip to target brachialis.", 4));
        ex.add(e("Incline Dumbbell Curl",    "Strength","biceps",     "INTERMEDIATE","Dumbbells, Incline Bench","Curl dumbbells on incline bench for deep stretch.", 5));
        ex.add(e("Preacher Curl",            "Strength","biceps",     "INTERMEDIATE","EZ Bar, Preacher Bench",  "Curl bar with arms braced on preacher bench.", 5));
        ex.add(e("Concentration Curl",       "Strength","biceps",     "BEGINNER",    "Dumbbell",                "Curl with elbow braced on inner thigh for isolation.", 4));
        ex.add(e("Cable Curl",               "Strength","biceps",     "BEGINNER",    "Cable Machine",           "Curl cable bar from low pulley for constant tension.", 4));

        // ── TRICEPS ───────────────────────────────────────────────────────
        ex.add(e("Tricep Pushdown",          "Strength","triceps",    "BEGINNER",    "Cable Machine",           "Push cable bar downward from chest to hip using triceps.", 4));
        ex.add(e("Skull Crushers",           "Strength","triceps",    "INTERMEDIATE","EZ Bar, Flat Bench",      "Lower EZ bar to forehead while lying on bench.", 5));
        ex.add(e("Overhead Tricep Extension","Strength","triceps",    "BEGINNER",    "Dumbbell",                "Extend dumbbell overhead with both hands behind head.", 4));
        ex.add(e("Close-Grip Bench Press",   "Strength","triceps",    "INTERMEDIATE","Barbell, Bench",          "Bench press with narrow grip to emphasise triceps.", 7));
        ex.add(e("Diamond Push-Ups",         "Strength","triceps",    "INTERMEDIATE","Bodyweight",              "Push-ups with hands close together forming diamond shape.", 6));
        ex.add(e("Tricep Kickback",          "Strength","triceps",    "BEGINNER",    "Dumbbell",                "Bend forward and extend dumbbell backward using triceps.", 4));

        // ── ABS / CORE ────────────────────────────────────────────────────
        ex.add(e("Crunches",                 "Strength","abs",        "BEGINNER",    "Bodyweight",              "Lie on back and curl torso toward knees.", 5));
        ex.add(e("Plank",                    "Strength","abs",        "BEGINNER",    "Bodyweight",              "Hold push-up position with forearms on ground.", 4));
        ex.add(e("Hanging Leg Raise",        "Strength","abs",        "ADVANCED",    "Pull-Up Bar",             "Hang from bar and raise legs to horizontal or above.", 6));
        ex.add(e("Russian Twist",            "Strength","abs",        "INTERMEDIATE","Bodyweight",              "Sit with knees bent and rotate torso side to side.", 5));
        ex.add(e("Cable Woodchop",           "Strength","abs",        "INTERMEDIATE","Cable Machine",           "Pull cable from high to low in diagonal chopping motion.", 5));
        ex.add(e("Ab Wheel Rollout",         "Strength","abs",        "ADVANCED",    "Ab Wheel",                "Kneel and roll ab wheel forward then return to start.", 7));
        ex.add(e("Bicycle Crunch",           "Strength","abs",        "BEGINNER",    "Bodyweight",              "Alternate touching elbows to opposite knees in pedaling motion.", 5));
        ex.add(e("Mountain Climbers",        "Cardio",  "abs",        "BEGINNER",    "Bodyweight",              "In push-up position, drive knees alternately toward chest.", 8));

        // ── QUADS ─────────────────────────────────────────────────────────
        ex.add(e("Barbell Back Squat",       "Strength","quads",      "INTERMEDIATE","Barbell, Squat Rack",     "Place barbell on back and squat below parallel.", 10));
        ex.add(e("Front Squat",              "Strength","quads",      "ADVANCED",    "Barbell, Squat Rack",     "Hold barbell in front rack position and squat deep.", 9));
        ex.add(e("Leg Press",                "Strength","quads",      "BEGINNER",    "Leg Press Machine",       "Push weighted sled away using legs.", 8));
        ex.add(e("Leg Extension",            "Strength","quads",      "BEGINNER",    "Leg Extension Machine",   "Extend legs against resistance while seated.", 5));
        ex.add(e("Bulgarian Split Squat",    "Strength","quads",      "INTERMEDIATE","Dumbbells, Bench",        "Lunge with rear foot elevated on bench.", 7));
        ex.add(e("Walking Lunges",           "Strength","quads",      "BEGINNER",    "Dumbbells",               "Step forward into lunge and alternate legs while walking.", 7));
        ex.add(e("Goblet Squat",             "Strength","quads",      "BEGINNER",    "Dumbbell or Kettlebell",  "Hold weight at chest and squat to depth.", 7));
        ex.add(e("Hack Squat",               "Strength","quads",      "INTERMEDIATE","Hack Squat Machine",      "Squat on hack squat machine with back against pad.", 8));

        // ── HAMSTRINGS ────────────────────────────────────────────────────
        ex.add(e("Romanian Deadlift",        "Strength","hamstrings", "INTERMEDIATE","Barbell",                 "Hinge at hips with barbell while keeping legs nearly straight.", 8));
        ex.add(e("Lying Leg Curl",           "Strength","hamstrings", "BEGINNER",    "Leg Curl Machine",        "Curl weight toward glutes while lying face down.", 5));
        ex.add(e("Seated Leg Curl",          "Strength","hamstrings", "BEGINNER",    "Seated Leg Curl Machine", "Curl pad under seat using hamstrings.", 5));
        ex.add(e("Nordic Hamstring Curl",    "Strength","hamstrings", "ADVANCED",    "Bodyweight",              "Kneel and slowly lower body forward using hamstring control.", 7));
        ex.add(e("Good Morning",             "Strength","hamstrings", "INTERMEDIATE","Barbell",                 "Hinge forward at hips with barbell on back.", 6));
        ex.add(e("Stiff-Leg Deadlift",       "Strength","hamstrings", "INTERMEDIATE","Dumbbells",               "Deadlift with minimal knee bend to isolate hamstrings.", 7));

        // ── GLUTES ────────────────────────────────────────────────────────
        ex.add(e("Barbell Hip Thrust",       "Strength","glutes",     "INTERMEDIATE","Barbell, Bench",          "Drive barbell upward by extending hips — upper back on bench.", 8));
        ex.add(e("Glute Bridge",             "Strength","glutes",     "BEGINNER",    "Bodyweight",              "Lie on back and lift hips to ceiling squeezing glutes.", 5));
        ex.add(e("Cable Kickback",           "Strength","glutes",     "BEGINNER",    "Cable Machine, Ankle Strap","Kick one leg backward against cable resistance.", 4));
        ex.add(e("Sumo Deadlift",            "Strength","glutes",     "INTERMEDIATE","Barbell",                 "Deadlift with wide stance to emphasise glutes and inner thighs.", 9));
        ex.add(e("Step-Ups",                 "Strength","glutes",     "BEGINNER",    "Box, Dumbbells",          "Step onto box one leg at a time holding dumbbells.", 6));
        ex.add(e("Donkey Kick",              "Strength","glutes",     "BEGINNER",    "Bodyweight",              "On all fours, drive one leg upward toward ceiling.", 4));

        // ── CALVES ────────────────────────────────────────────────────────
        ex.add(e("Standing Calf Raise",      "Strength","calves",     "BEGINNER",    "Calf Raise Machine",      "Rise onto toes with weight on shoulders.", 4));
        ex.add(e("Seated Calf Raise",        "Strength","calves",     "BEGINNER",    "Seated Calf Machine",     "Rise onto toes while seated with weight on knees.", 3));
        ex.add(e("Single-Leg Calf Raise",    "Strength","calves",     "BEGINNER",    "Bodyweight",              "Balance on one leg and raise heel off the ground.", 3));
        ex.add(e("Donkey Calf Raise",        "Strength","calves",     "INTERMEDIATE","Machine or Partner",       "Bend at hips and raise heels with weight on back.", 4));

        // ── TRAPS ─────────────────────────────────────────────────────────
        ex.add(e("Barbell Shrug",            "Strength","traps",      "BEGINNER",    "Barbell",                 "Hold barbell at hip level and shrug shoulders upward.", 4));
        ex.add(e("Dumbbell Shrug",           "Strength","traps",      "BEGINNER",    "Dumbbells",               "Hold dumbbells at sides and shrug shoulders to ears.", 4));
        ex.add(e("Farmer Walk",              "Strength","traps",      "INTERMEDIATE","Heavy Dumbbells",          "Walk with heavy weights in each hand maintaining posture.", 6));
        ex.add(e("Rack Pulls",               "Strength","traps",      "INTERMEDIATE","Barbell, Squat Rack",      "Deadlift from knee height to lockout to overload traps.", 7));

        // ── LOWER BACK ────────────────────────────────────────────────────
        ex.add(e("Back Extension",           "Strength","lowerback",  "BEGINNER",    "Roman Chair",             "Hinge over roman chair and extend torso upward.", 5));
        ex.add(e("Superman Hold",            "Strength","lowerback",  "BEGINNER",    "Bodyweight",              "Lie face down and lift arms and legs simultaneously.", 4));
        ex.add(e("Reverse Hyperextension",   "Strength","lowerback",  "INTERMEDIATE","Reverse Hyper Machine",    "Swing legs upward while lying face down on platform.", 5));
        ex.add(e("Bird Dog",                 "Strength","lowerback",  "BEGINNER",    "Bodyweight",              "On all fours, extend opposite arm and leg while balancing.", 3));

        // ── CARDIO ────────────────────────────────────────────────────────
        ex.add(e("Running (Treadmill)",      "Cardio",  "cardio",     "BEGINNER",    "Treadmill",               "Steady-state running on treadmill at moderate pace.", 10));
        ex.add(e("Jump Rope",                "Cardio",  "cardio",     "BEGINNER",    "Jump Rope",               "Skip rope at steady pace for cardiovascular endurance.", 12));
        ex.add(e("Burpees",                  "Cardio",  "cardio",     "INTERMEDIATE","Bodyweight",              "Squat, kick back to plank, push-up, jump up — repeat.", 10));
        ex.add(e("Rowing Machine",           "Cardio",  "cardio",     "BEGINNER",    "Rowing Machine",           "Row on ergometer for full-body cardiovascular training.", 9));
        ex.add(e("Cycling (Stationary)",     "Cardio",  "cardio",     "BEGINNER",    "Stationary Bike",         "Pedal stationary bike at moderate to high intensity.", 8));
        ex.add(e("Box Jumps",                "Cardio",  "cardio",     "INTERMEDIATE","Plyo Box",                "Jump onto raised box and step or jump back down.", 9));
        ex.add(e("Brisk Walking",            "Cardio",  "cardio",     "BEGINNER",    "Treadmill or Outdoor",    "Moderate-pace walk for low-impact cardiovascular training.", 5));
        ex.add(e("Stair Climber",            "Cardio",  "cardio",     "INTERMEDIATE","Stair Climber Machine",    "Climb stairs on machine for cardio and leg conditioning.", 9));
        ex.add(e("HIIT Sprints",             "Cardio",  "cardio",     "ADVANCED",    "Treadmill or Track",      "Alternate max-effort sprints with active recovery intervals.", 14));

        // ── FLEXIBILITY ───────────────────────────────────────────────────
        ex.add(e("Yoga Flow",                "Flexibility","cardio",  "BEGINNER",    "Bodyweight",              "Sun-salutation yoga flow for mobility and flexibility.", 4));
        ex.add(e("Full-Body Stretching",     "Flexibility","cardio",  "BEGINNER",    "Bodyweight",              "Static full-body stretch routine — hold each 30 sec.", 3));
        ex.add(e("Foam Rolling",             "Flexibility","cardio",  "BEGINNER",    "Foam Roller",             "Myofascial release — roll slowly over tight muscle groups.", 3));

        exerciseLibraryRepository.saveAll(ex);
        System.out.println("Initialized " + ex.size() + " exercises");
    }

    private void initializeFoods() {
        if (foodLibraryRepository.count() > 0) {
            System.out.println("Food library already populated (" 
                + foodLibraryRepository.count() + " items) — skipping seed.");
            return;
        }

        List<FoodLibrary> foods = new ArrayList<>();

        // ═══════════════════════════════════════════════════════════════════
        // BREAKFAST
        // ═══════════════════════════════════════════════════════════════════

        // Grains / Carb-heavy (BALANCED, HIGH_CARB)
        foods.add(f("Oatmeal (rolled oats)",         307, 10.5f, 55f,  5f,   "1 cup dry",       "Breakfast"));
        foods.add(f("Whole Wheat Toast",               80,  4f,  15f,  1f,   "1 slice",          "Breakfast"));
        foods.add(f("Brown Bread",                    120,  5f,  22f,  2f,   "2 slices",         "Breakfast"));
        foods.add(f("Granola",                        200,  5f,  33f,  7f,   "50g",              "Breakfast"));
        foods.add(f("Muesli",                         210,  6f,  40f,  4f,   "60g",              "Breakfast"));
        foods.add(f("Whole Wheat Pancakes",           180,  6f,  32f,  3f,   "2 medium",         "Breakfast"));
        foods.add(f("Quinoa Porridge",                220,  8f,  39f,  4f,   "1 cup cooked",     "Breakfast"));

        // Eggs & Dairy (BALANCED, HIGH_PROTEIN, VEGETARIAN)
        foods.add(f("Scrambled Eggs (2 eggs)",        180, 12f,   2f, 14f,   "2 large",          "Breakfast"));
        foods.add(f("Boiled Eggs",                    140, 12f,   1f, 10f,   "2 large",          "Breakfast"));
        foods.add(f("Omelette (2 eggs + veggies)",    200, 14f,   6f, 13f,   "1 serving",        "Breakfast"));
        foods.add(f("Greek Yogurt (plain, full fat)", 166, 15f,   9f,  9f,   "200g",             "Breakfast"));
        foods.add(f("Greek Yogurt (non-fat)",         100, 17f,   6f,  0.5f, "170g",             "Breakfast"));
        foods.add(f("Cottage Cheese",                 206, 28f,   8f,  4f,   "1 cup",            "Breakfast"));
        foods.add(f("Low-Fat Milk",                   103,  8f,  12f,  2.5f, "1 cup (240ml)",    "Breakfast"));
        foods.add(f("Paneer (Indian cottage cheese)", 265, 18f,   3f, 21f,   "100g",             "Breakfast"));

        // High-protein / Low-carb (KETO, LOW_CARB, HIGH_PROTEIN)
        foods.add(f("Avocado",                        160,  2f,   9f, 15f,   "1 medium",         "Breakfast"));
        foods.add(f("Peanut Butter",                  190,  8f,   6f, 16f,   "2 tbsp",           "Breakfast"));
        foods.add(f("Almond Butter",                  196,  7f,   6f, 18f,   "2 tbsp",           "Breakfast"));
        foods.add(f("Smoked Salmon",                  117, 18f,   0f,  4.5f, "80g",              "Breakfast"));
        foods.add(f("Protein Smoothie (whey)",        320, 30f,  28f,  7f,   "1 shake",          "Breakfast"));

        // Fruits (BALANCED, VEGAN, VEGETARIAN)
        foods.add(f("Banana",                         105,  1.3f,27f,  0.4f, "1 medium",         "Breakfast"));
        foods.add(f("Blueberries",                     84,  1f,  21f,  0.5f, "1 cup",            "Breakfast"));
        foods.add(f("Strawberries",                    49,  1f,  12f,  0.5f, "1 cup",            "Breakfast"));
        foods.add(f("Apple",                           95,  0.5f,25f,  0.3f, "1 medium",         "Breakfast"));
        foods.add(f("Orange",                          62,  1.2f,15f,  0.2f, "1 medium",         "Breakfast"));
        foods.add(f("Mixed Fruit Bowl",               120,  2f,  30f,  0.5f, "1 cup",            "Breakfast"));

        // Vegan-specific breakfast
        foods.add(f("Chia Seed Pudding",              240,  8f,  28f, 12f,   "1 cup",            "Breakfast"));
        foods.add(f("Tofu Scramble",                  190, 15f,   8f, 11f,   "150g",             "Breakfast"));
        foods.add(f("Soy Milk",                        80,  7f,   4f,  4f,   "1 cup (240ml)",    "Breakfast"));
        foods.add(f("Overnight Oats (almond milk)",   320, 10f,  54f,  8f,   "1 jar",            "Breakfast"));

        // ═══════════════════════════════════════════════════════════════════
        // LUNCH
        // ═══════════════════════════════════════════════════════════════════

        // Non-vegetarian proteins (HIGH_PROTEIN, BALANCED)
        foods.add(f("Grilled Chicken Breast",         165, 31f,   0f,  3.6f, "100g",             "Lunch"));
        foods.add(f("Chicken Thigh (grilled)",        209, 26f,   0f, 11f,   "100g",             "Lunch"));
        foods.add(f("Tuna (canned in water)",         116, 25.5f, 0f,  0.8f, "100g",             "Lunch"));
        foods.add(f("Salmon Fillet (baked)",          208, 20f,   0f, 13f,   "100g",             "Lunch"));
        foods.add(f("Turkey Breast",                  150, 30f,   0f,  1.5f, "100g",             "Lunch"));
        foods.add(f("Shrimp (steamed)",                99, 24f,   0f,  0.3f, "100g",             "Lunch"));
        foods.add(f("Lean Beef Mince (90/10)",        215, 26f,   0f, 12f,   "100g",             "Lunch"));
        foods.add(f("Egg White Wrap",                 200, 20f,  18f,  5f,   "1 wrap",           "Lunch"));

        // Vegetarian proteins
        foods.add(f("Lentil Soup",                    230, 18f,  40f,  0.8f, "1 bowl (300ml)",   "Lunch"));
        foods.add(f("Chickpea Salad",                 270, 14f,  45f,  4f,   "1 serving",        "Lunch"));
        foods.add(f("Paneer Tikka",                   280, 20f,   6f, 20f,   "150g",             "Lunch"));
        foods.add(f("Eggs (hard boiled)",             140, 12f,   1f, 10f,   "2 large",          "Lunch"));
        foods.add(f("Cheese & Veggie Sandwich",       320, 14f,  38f, 12f,   "1 sandwich",       "Lunch"));
        foods.add(f("Greek Salad with Feta",          200,  7f,  12f, 15f,   "1 serving",        "Lunch"));

        // Vegan proteins
        foods.add(f("Tofu (firm, pan-fried)",         200, 16f,   5f, 13f,   "150g",             "Lunch"));
        foods.add(f("Tempeh",                         195, 19f,   9f, 11f,   "100g",             "Lunch"));
        foods.add(f("Black Bean Bowl",                340, 15f,  60f,  3f,   "1 bowl",           "Lunch"));
        foods.add(f("Edamame",                        188, 18f,  14f,  8f,   "1 cup shelled",    "Lunch"));
        foods.add(f("Mixed Dal (lentils)",            240, 15f,  42f,  1.5f, "1 bowl",           "Lunch"));
        foods.add(f("Hummus & Veggie Plate",          280, 10f,  30f, 14f,   "1 serving",        "Lunch"));

        // Carbs / Sides
        foods.add(f("Brown Rice",                     215,  5f,  45f,  1.8f, "1 cup cooked",     "Lunch"));
        foods.add(f("White Rice",                     206,  4.3f,45f,  0.4f, "1 cup cooked",     "Lunch"));
        foods.add(f("Quinoa",                         222,  8f,  39f,  3.6f, "1 cup cooked",     "Lunch"));
        foods.add(f("Sweet Potato (baked)",           180,  4f,  41f,  0.3f, "1 medium",         "Lunch"));
        foods.add(f("Broccoli (steamed)",              55,  3.7f,11f,  0.6f, "1 cup",            "Lunch"));
        foods.add(f("Mixed Salad Greens",              20,  2f,   3f,  0.3f, "2 cups",           "Lunch"));
        foods.add(f("Whole Wheat Pasta",              174,  7f,  37f,  1.3f, "1 cup cooked",     "Lunch"));
        foods.add(f("Corn Tortilla",                  110,  3f,  23f,  1.5f, "2 medium",         "Lunch"));
        foods.add(f("Spinach",                         23,  2.9f, 3.6f,0.4f, "1 cup raw",        "Lunch"));

        // Keto / Low-carb lunches
        foods.add(f("Grilled Chicken Caesar Salad",   350, 35f,   8f, 20f,   "1 bowl",           "Lunch"));
        foods.add(f("Tuna Avocado Bowl",              390, 35f,  10f, 22f,   "1 bowl",           "Lunch"));
        foods.add(f("Cauliflower Rice Bowl",          230, 25f,  14f, 10f,   "1 bowl",           "Lunch"));
        foods.add(f("Zucchini Noodles with Chicken",  290, 30f,  12f, 14f,   "1 serving",        "Lunch"));
        foods.add(f("Lettuce Wrap Tacos",             260, 22f,   8f, 16f,   "3 wraps",          "Lunch"));

        // ═══════════════════════════════════════════════════════════════════
        // DINNER
        // ═══════════════════════════════════════════════════════════════════

        // Non-vegetarian
        foods.add(f("Baked Salmon",                   208, 22f,   0f, 13f,   "150g",             "Dinner"));
        foods.add(f("Grilled Chicken with Veggies",   310, 38f,  14f,  9f,   "1 plate",          "Dinner"));
        foods.add(f("Beef Steak (sirloin)",           271, 26f,   0f, 18f,   "150g",             "Dinner"));
        foods.add(f("Chicken Curry (mild)",           350, 30f,  18f, 16f,   "1 bowl",           "Dinner"));
        foods.add(f("Baked Cod",                      105, 23f,   0f,  0.9f, "150g",             "Dinner"));
        foods.add(f("Lamb Chops",                     294, 25f,   0f, 21f,   "150g",             "Dinner"));
        foods.add(f("Shrimp Stir-Fry",               280, 28f,  18f,  9f,   "1 plate",          "Dinner"));
        foods.add(f("Fish Tacos",                     380, 28f,  36f, 13f,   "2 tacos",          "Dinner"));
        foods.add(f("Turkey Meatballs with Sauce",    370, 32f,  22f, 15f,   "1 serving",        "Dinner"));

        // Vegetarian dinners
        foods.add(f("Paneer Curry",                   380, 20f,  18f, 26f,   "1 bowl",           "Dinner"));
        foods.add(f("Vegetable Biryani",              420, 10f,  75f,  9f,   "1 serving",        "Dinner"));
        foods.add(f("Pasta Primavera",                380, 13f,  68f,  7f,   "1 plate",          "Dinner"));
        foods.add(f("Cheese Pizza (thin crust, 2 sl)",460, 20f,  56f, 18f,   "2 slices",         "Dinner"));
        foods.add(f("Caprese Salad",                  260, 15f,   8f, 20f,   "1 serving",        "Dinner"));
        foods.add(f("Mushroom Risotto",               400, 10f,  65f, 12f,   "1 bowl",           "Dinner"));
        foods.add(f("Veggie Burger",                  340, 15f,  45f, 11f,   "1 burger",         "Dinner"));

        // Vegan dinners
        foods.add(f("Tofu & Vegetable Stir-Fry",     320, 18f,  30f, 14f,   "1 plate",          "Dinner"));
        foods.add(f("Chickpea Masala",                350, 14f,  55f,  8f,   "1 bowl",           "Dinner"));
        foods.add(f("Lentil Dal with Rice",           420, 18f,  75f,  4f,   "1 plate",          "Dinner"));
        foods.add(f("Buddha Bowl (tofu + veggies)",   450, 20f,  58f, 16f,   "1 bowl",           "Dinner"));
        foods.add(f("Black Bean Tacos (corn tortilla)",380, 14f, 58f, 10f,   "2 tacos",          "Dinner"));
        foods.add(f("Vegan Pasta (with tomato sauce)",360, 12f,  68f,  5f,   "1 plate",          "Dinner"));
        foods.add(f("Jackfruit Curry",                290, 4f,   52f,  7f,   "1 bowl",           "Dinner"));

        // Keto / Low-carb dinners
        foods.add(f("Grilled Salmon with Asparagus", 340, 36f,   8f, 19f,   "1 plate",          "Dinner"));
        foods.add(f("Steak with Roasted Broccoli",   420, 38f,  10f, 26f,   "1 plate",          "Dinner"));
        foods.add(f("Cauliflower Fried Rice (chicken)",330, 30f,  15f, 16f, "1 plate",           "Dinner"));
        foods.add(f("Egg Fried Cauliflower Rice",    290, 16f,  14f, 20f,   "1 plate",          "Dinner"));
        foods.add(f("Avocado Chicken Bowl",           490, 40f,  14f, 31f,   "1 bowl",           "Dinner"));

        // ═══════════════════════════════════════════════════════════════════
        // SNACK
        // ═══════════════════════════════════════════════════════════════════

        // Protein snacks (HIGH_PROTEIN, BALANCED)
        foods.add(f("Whey Protein Shake",             130, 25f,   5f,  2f,   "1 scoop (30g)",    "Snack"));
        foods.add(f("Protein Bar",                    200, 20f,  20f,  7f,   "1 bar (55g)",      "Snack"));
        foods.add(f("Hard Boiled Egg",                 78,  6f,   0.6f, 5f,  "1 large",          "Snack"));
        foods.add(f("Beef Jerky",                     116, 20f,   4f,  3f,   "30g",              "Snack"));
        foods.add(f("Tuna on Rice Cakes",             150, 18f,  12f,  2f,   "2 rice cakes",     "Snack"));
        foods.add(f("Cottage Cheese (small bowl)",    110, 14f,   5f,  2.5f, "125g",             "Snack"));

        // Nut & Seed snacks (BALANCED, KETO, LOW_CARB)
        foods.add(f("Mixed Nuts",                     173,  5f,   6f, 16f,   "30g",              "Snack"));
        foods.add(f("Almonds",                        164,  6f,   6f, 14f,   "30g",              "Snack"));
        foods.add(f("Walnuts",                        185,  4.3f, 4f, 18.5f, "30g",              "Snack"));
        foods.add(f("Cashews",                        157,  5f,   9f, 12f,   "30g",              "Snack"));
        foods.add(f("Peanut Butter on Apple",         230,  7f,  27f, 12f,   "1 apple + 1 tbsp", "Snack"));
        foods.add(f("Sunflower Seeds",                166,  5.5f, 7f, 14f,   "30g",              "Snack"));

        // Dairy / Yogurt snacks
        foods.add(f("Greek Yogurt with Berries",      160, 12f,  18f,  4f,   "150g + berries",   "Snack"));
        foods.add(f("Cheese Slice (cheddar)",         113,  7f,   0.4f, 9f,  "30g",              "Snack"));
        foods.add(f("Mozzarella Sticks",              170, 12f,   1f, 13f,   "40g",              "Snack"));
        foods.add(f("Low-Fat Chocolate Milk",         160,  8f,  26f,  2.5f, "240ml",            "Snack"));

        // Fruit snacks (VEGAN, VEGETARIAN, BALANCED)
        foods.add(f("Banana",                          89,  1.1f,23f,  0.3f, "1 medium",         "Snack"));
        foods.add(f("Apple",                           52,  0.3f,14f,  0.2f, "1 medium",         "Snack"));
        foods.add(f("Orange",                          47,  0.9f,12f,  0.1f, "1 medium",         "Snack"));
        foods.add(f("Mixed Berries",                   70,  1.5f,17f,  0.5f, "1 cup",            "Snack"));
        foods.add(f("Mango Slices",                    99,  1.4f,25f,  0.6f, "1 cup",            "Snack"));
        foods.add(f("Dates",                          110,  1f,  30f,  0.1f, "4 pieces",         "Snack"));

        // Light / Veggie snacks
        foods.add(f("Carrot Sticks & Hummus",         130,  4f,  18f,  5f,   "10 sticks + 30g",  "Snack"));
        foods.add(f("Rice Cakes (plain)",              70,  1.5f,15f,  0.5f, "2 cakes",          "Snack"));
        foods.add(f("Celery with Peanut Butter",      150,  5f,  10f, 11f,   "3 stalks + 1 tbsp","Snack"));
        foods.add(f("Edamame",                        120, 11f,   9f,  5f,   "100g shelled",     "Snack"));
        foods.add(f("Dark Chocolate (85%)",           170,  3f,  13f, 12f,   "30g",              "Snack"));
        foods.add(f("Popcorn (air-popped)",            93,  3f,  19f,  1f,   "3 cups",           "Snack"));

        foodLibraryRepository.saveAll(foods);
        System.out.println("Initialized " + foods.size() + " foods in library");
    }

    private ExerciseLibrary e(String name, String category, String muscleGroup,
                              String difficulty, String equipment,
                              String description, int caloriesPerMin) {
        ExerciseLibrary ex = new ExerciseLibrary();
        ex.setExerciseName(name);
        ex.setCategory(category);
        ex.setMuscleGroup(muscleGroup);
        ex.setDifficultyLevel(difficulty);
        ex.setEquipment(equipment);
        ex.setDescription(description);
        ex.setCaloriesBurnedPerMin(caloriesPerMin);
        ex.setCreatedAt(LocalDateTime.now());
        return ex;
    }

    private FoodLibrary f(String name, int calories, float protein,
                          float carbs, float fats, String serving, String category) {
        FoodLibrary food = new FoodLibrary();
        food.setFoodName(name);
        food.setCaloriesPerServing(calories);
        food.setProteinGrams(protein);
        food.setCarbsGrams(carbs);
        food.setFatsGrams(fats);
        food.setServingSize(serving);
        food.setCategory(category);
        food.setCreatedAt(LocalDateTime.now());
        return food;
}

}