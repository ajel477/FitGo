// Workout data with instructions for different workout types

// Define workout instructions by type
export const workoutInstructions = {
  fullBodyStrength: [
    { 
      step: 1, 
      description: "Warm up with 5 minutes of light cardio",
      details: {
        duration: "5 minutes",
        form: "Start with a light jog in place, arm circles, and jumping jacks to increase heart rate gradually."
      }
    },
    { 
      step: 2, 
      description: "Push-ups: 3 sets of 15 reps",
      details: {
        sets: "3",
        reps: "15",
        rest: "60 seconds between sets",
        form: "Keep your body in a straight line from head to heels. Lower your chest to the ground, then push back up. Modify on knees if needed."
      }
    },
    { 
      step: 3, 
      description: "Squats: 3 sets of 20 reps",
      details: {
        sets: "3",
        reps: "20",
        rest: "60 seconds between sets",
        form: "Stand with feet shoulder-width apart. Lower your hips as if sitting in a chair, keeping knees in line with toes. Drive through heels to stand."
      }
    },
    { 
      step: 4, 
      description: "Dumbbell rows: 3 sets of 12 reps each arm",
      details: {
        sets: "3",
        reps: "12 per arm",
        rest: "45 seconds between sets",
        form: "Place one knee and hand on a bench, with other foot on the ground. Pull dumbbell to hip, keeping elbow close to body."
      }
    },
    { 
      step: 5, 
      description: "Lunges: 3 sets of 10 reps each leg",
      details: {
        sets: "3",
        reps: "10 per leg",
        rest: "60 seconds between sets",
        form: "Step forward with one leg, lowering hips until both knees are bent at 90 degrees. Front knee should be above ankle, not pushed forward past toes."
      }
    },
    { 
      step: 6, 
      description: "Plank: 3 sets of 45 seconds",
      details: {
        sets: "3",
        duration: "45 seconds",
        rest: "30 seconds between sets",
        form: "Support your weight on forearms and toes. Keep body in a straight line with core engaged. Avoid raising hips or sagging in the middle."
      }
    },
    { 
      step: 7, 
      description: "Cool down with stretching for 5 minutes",
      details: {
        duration: "5 minutes",
        form: "Gently stretch all major muscle groups used in the workout. Hold each stretch for 20-30 seconds without bouncing."
      }
    }
  ],
  
  intervalRunning: [
    { 
      step: 1, 
      description: "5-minute easy jog to warm up",
      details: {
        duration: "5 minutes",
        form: "Start with a light jog at a conversational pace to gradually increase heart rate and warm up muscles."
      }
    },
    { 
      step: 2, 
      description: "Run at moderate pace for 3 minutes",
      details: {
        duration: "3 minutes",
        form: "Increase to a moderate pace where you can speak in short sentences. Focus on maintaining good posture with relaxed shoulders."
      }
    },
    { 
      step: 3, 
      description: "Sprint for 1 minute",
      details: {
        duration: "1 minute",
        form: "Push to about 80% of your maximum effort. Drive your arms and knees and maintain an upright posture."
      }
    },
    { 
      step: 4, 
      description: "Repeat steps 2-3 for a total of 5 rounds",
      details: {
        sets: "5 rounds",
        form: "Focus on consistent pacing for each interval. Each round should feel challenging but maintainable."
      }
    },
    { 
      step: 5, 
      description: "Recovery jog for 5 minutes",
      details: {
        duration: "5 minutes",
        form: "Slow to an easy jog or brisk walk to gradually bring your heart rate down."
      }
    },
    { 
      step: 6, 
      description: "Cool down with 5 minutes of walking and stretching",
      details: {
        duration: "5 minutes",
        form: "Walk slowly to normalize breathing, then perform static stretches focusing on calves, hamstrings, quads, and hip flexors."
      }
    }
  ],
  
  dynamicStretching: [
    { 
      step: 1, 
      description: "Light cardio warm-up for 3 minutes",
      details: {
        duration: "3 minutes",
        form: "Perform marching in place, light jumping jacks, or arm circles to increase body temperature before stretching."
      }
    },
    { 
      step: 2, 
      description: "Neck and shoulder mobility series",
      details: {
        duration: "3 minutes",
        form: "Perform neck rotations, shoulder rolls, and arm circles to release tension in the upper body. Move slowly and with control."
      }
    },
    { 
      step: 3, 
      description: "Hip opener sequence",
      details: {
        duration: "5 minutes",
        form: "Include leg swings, hip circles, and standing figure-four stretches. Focus on controlled movement and breathing into any tight areas."
      }
    },
    { 
      step: 4, 
      description: "Hamstring and calf stretches",
      details: {
        duration: "5 minutes",
        form: "Forward folds, straight leg raises, and downward dog variations. Hold each position for 20-30 seconds."
      }
    },
    { 
      step: 5, 
      description: "Spinal mobility flow",
      details: {
        duration: "5 minutes",
        form: "Cat-cow stretches, spinal twists, and gentle side bends to improve back flexibility. Move with your breath."
      }
    },
    { 
      step: 6, 
      description: "Final relaxation in corpse pose",
      details: {
        duration: "4 minutes",
        form: "Lie flat on your back with arms at sides and palms facing up. Close your eyes and focus on relaxing each part of your body."
      }
    }
  ],
  
  tabataChallenge: [
    { 
      step: 1, 
      description: "Dynamic warm-up for 4 minutes",
      details: {
        duration: "4 minutes",
        form: "Include jumping jacks, high knees, butt kicks, and arm swings to prepare for high-intensity work."
      }
    },
    { 
      step: 2, 
      description: "Squat jumps: 20 seconds work, 10 seconds rest - 8 rounds",
      details: {
        sets: "8 rounds",
        work: "20 seconds",
        rest: "10 seconds",
        form: "Start in squat position, explode upward into a jump, land softly back into squat. Maintain proper form throughout."
      }
    },
    { 
      step: 3, 
      description: "Rest 1 minute",
      details: {
        duration: "1 minute",
        form: "Take deep breaths and shake out your legs to prepare for the next exercise."
      }
    },
    { 
      step: 4, 
      description: "Push-up variations: 20 seconds work, 10 seconds rest - 8 rounds",
      details: {
        sets: "8 rounds",
        work: "20 seconds",
        rest: "10 seconds",
        form: "Perform standard push-ups or modify as needed. Focus on quality over quantity while maintaining maximum effort."
      }
    },
    { 
      step: 5, 
      description: "Rest 1 minute",
      details: {
        duration: "1 minute",
        form: "Recover with deep breathing before the final exercise."
      }
    },
    { 
      step: 6, 
      description: "Mountain climbers: 20 seconds work, 10 seconds rest - 8 rounds",
      details: {
        sets: "8 rounds",
        work: "20 seconds",
        rest: "10 seconds",
        form: "Start in plank position, rapidly alternate bringing knees to chest. Keep your core engaged and hips stable."
      }
    },
    { 
      step: 7, 
      description: "Cool down with 3 minutes of stretching",
      details: {
        duration: "3 minutes",
        form: "Perform slow, static stretches for all major muscle groups worked. Hold each stretch for 30 seconds."
      }
    }
  ]
};

// Define all workouts
export const getAllWorkouts = () => {
  const timestamp = new Date().getTime();
  
  return [
    {
      id: 1,
      title: "Full Body Strength",
      description: "Complete circuit of push-ups, squats, and dumbbell exercises for total body conditioning.",
      duration: "45 min",
      difficulty: "Intermediate",
      category: "Strength",
      created_at: new Date(timestamp + 1).toISOString(),
      instructions: workoutInstructions.fullBodyStrength
    },
    {
      id: 2,
      title: "HIIT Cardio Blast",
      description: "High-intensity intervals with minimal rest periods to maximize calorie burn and cardiovascular endurance.",
      duration: "30 min",
      difficulty: "Advanced",
      category: "HIIT",
      created_at: new Date(timestamp + 2).toISOString(),
      instructions: workoutInstructions.tabataChallenge
    },
    {
      id: 3,
      title: "Yoga Flow",
      description: "Dynamic yoga sequence for flexibility and strength that combines breath work with flowing movement.",
      duration: "60 min",
      difficulty: "Beginner",
      category: "Flexibility",
      created_at: new Date(timestamp + 3).toISOString(),
      instructions: workoutInstructions.dynamicStretching
    },
    {
      id: 4,
      title: "Endurance Run",
      description: "Steady-state cardio to build stamina and improve overall cardiovascular fitness with varied intensity.",
      duration: "40 min",
      difficulty: "Intermediate",
      category: "Cardio",
      created_at: new Date(timestamp + 4).toISOString(),
      instructions: workoutInstructions.intervalRunning
    },
    {
      id: 5,
      title: "Core Crusher",
      description: "Focus on abdominal and lower back strength with planks, crunches, and rotational movements.",
      duration: "25 min",
      difficulty: "Intermediate", 
      category: "Strength",
      created_at: new Date(timestamp + 5).toISOString(),
      instructions: workoutInstructions.fullBodyStrength
    },
    {
      id: 6,
      title: "Tabata Training",
      description: "20 seconds on, 10 seconds off for 4 minutes per exercise - maximum effort interval training.",
      duration: "20 min",
      difficulty: "Advanced",
      category: "HIIT",
      created_at: new Date(timestamp + 6).toISOString(),
      instructions: workoutInstructions.tabataChallenge
    },
    {
      id: 7,
      title: "Interval Running",
      description: "Structured running workout with speed intervals to improve cardiovascular fitness and endurance.",
      duration: "35 min", 
      difficulty: "Intermediate",
      category: "Cardio",
      created_at: new Date(timestamp + 7).toISOString(),
      instructions: workoutInstructions.intervalRunning
    },
    {
      id: 8,
      title: "Dynamic Stretching Flow",
      description: "A series of active stretches to improve range of motion, flexibility, and prevent injury.",
      duration: "25 min",
      difficulty: "Beginner",
      category: "Flexibility",
      created_at: new Date(timestamp + 8).toISOString(),
      instructions: workoutInstructions.dynamicStretching
    },
    {
      id: 9,
      title: "Tabata Challenge",
      description: "Ultra-efficient workout using the 20-10 Tabata protocol for maximum intensity in minimal time.",
      duration: "20 min",
      difficulty: "Advanced",
      category: "HIIT",
      created_at: new Date(timestamp + 9).toISOString(),
      instructions: workoutInstructions.tabataChallenge
    }
  ];
}; 