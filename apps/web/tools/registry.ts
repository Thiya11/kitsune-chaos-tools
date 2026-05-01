export type ToolStatus = 'live' | 'wip' | 'planned'
export type ToolCategory = 'electronics' | 'physics' | 'chemistry' | 'math'

export interface ToolEntry {
  slug: string
  name: string
  category: ToolCategory
  description: string
  component: string
  status: ToolStatus
  tags?: string[]
  seoTitle?: string
  seoDescription?: string
  keywords?: string[]
  formula?: {
    title: string
    expression: string
    body: string
  }
  guide?: {
    heading: string
    body: string[]
  }[]
  examples?: {
    title: string
    body: string
  }[]
  faqs?: {
    question: string
    answer: string
  }[]
  relatedTools?: {
    label: string
    href: string
    description: string
  }[]
  /** Icon character - keep it short */
  icon?: string
}

export const tools: ToolEntry[] = [
  {
    slug: 'ohms-law',
    name: "Ohm's Law Calculator",
    category: 'electronics',
    description: 'Solve for voltage, current, or resistance interactively with a live circuit diagram.',
    component: 'OhmsLaw',
    status: 'live',
    tags: ['Circuits', 'Electronics', 'Calculator'],
    seoTitle: "Ohm's Law Calculator — Calculate Voltage, Current & Resistance",
    seoDescription:
      "Use this interactive Ohm's Law calculator to solve voltage, current, and resistance with the V = IR formula and clear circuit examples.",
    keywords: [
      "Ohm's Law Calculator",
      'voltage current resistance calculator',
      'V = IR calculator',
      "Ohm's Law formula",
      'calculate voltage',
      'calculate current',
      'calculate resistance',
    ],
    formula: {
      title: "Ohm's Law formula",
      expression: 'V = I × R',
      body:
        "The Ohm's Law formula says voltage equals current multiplied by resistance. Voltage is measured in volts (V), current is measured in amps (A), and resistance is measured in ohms (Ω). This V = IR calculator uses that relationship in each direction, so any two known values can solve the third.",
    },
    guide: [
      {
        heading: "What is Ohm's Law?",
        body: [
          "Ohm's Law describes the relationship between voltage, current, and resistance in an electrical circuit. Voltage is the electrical push, current is the flow of charge, and resistance is what limits that flow.",
          "This Ohm's Law Calculator is useful for quick answers, but it is also meant to make the relationship visible. Raise the resistance and current falls. Raise the voltage and current rises. Those changes are the formula playing out in the circuit.",
        ],
      },
      {
        heading: 'How to calculate voltage',
        body: [
          'To calculate voltage, multiply current by resistance: V = I × R. For example, if a circuit has 0.5 A of current through a 20 Ω resistor, the voltage is 0.5 × 20 = 10 V.',
          'Use this when you know how much current is flowing and the resistance of the load, and you want to find the voltage across it.',
        ],
      },
      {
        heading: 'How to calculate current',
        body: [
          'To calculate current, divide voltage by resistance: I = V / R. A 9 V battery connected to a 300 Ω resistor gives 9 / 300 = 0.03 A, or 30 mA.',
          'This is the most common use for a voltage current resistance calculator because it helps check whether a circuit is drawing a safe amount of current.',
        ],
      },
      {
        heading: 'How to calculate resistance',
        body: [
          'To calculate resistance, divide voltage by current: R = V / I. If a 5 V supply should produce 0.02 A, the needed resistance is 5 / 0.02 = 250 Ω.',
          'This is useful when choosing a resistor value for a simple load or checking whether a measured voltage and current make sense together.',
        ],
      },
      {
        heading: 'Common mistakes',
        body: [
          'The easiest mistake is mixing amps and milliamps. The formula uses amps, so 20 mA should be entered as 0.02 A. Entering 20 instead would mean 20 A, which is a thousand times larger.',
          "Another mistake is applying Ohm's Law as if every part behaves like a fixed resistor. LEDs, motors, and sensors often need extra context, but the formula is still a good starting point for the resistor or load you are actually calculating.",
        ],
      },
    ],
    examples: [
      {
        title: 'Small battery circuit',
        body: 'A 9 V battery and a 1,000 Ω resistor give I = 9 / 1000 = 0.009 A, or 9 mA.',
      },
      {
        title: 'Finding resistor voltage',
        body: 'If 0.25 A flows through a 40 Ω resistor, V = 0.25 × 40 = 10 V.',
      },
      {
        title: 'Choosing a resistance',
        body: 'If a circuit should draw 50 mA from 12 V, convert 50 mA to 0.05 A, then calculate R = 12 / 0.05 = 240 Ω.',
      },
    ],
    faqs: [
      {
        question: "What does an Ohm's Law Calculator solve?",
        answer:
          "It solves voltage, current, or resistance when you know the other two values. The calculator uses the Ohm's Law formula V = I × R and rearranges it as needed.",
      },
      {
        question: 'What units should I use?',
        answer:
          'Use volts for voltage, amps for current, and ohms for resistance. Convert milliamps to amps before calculating: 100 mA is 0.1 A.',
      },
      {
        question: 'Can I use this as a V = IR calculator?',
        answer:
          'Yes. The tool works as a V = IR calculator for voltage, and it also rearranges the same formula to calculate current or calculate resistance.',
      },
    ],
    relatedTools: [
      {
        label: 'Pendulum Simulator',
        href: '/tools/pendulum',
        description: 'Try another interactive learning tool for visualizing simple pendulum motion.',
      },
    ],
    icon: '⚡',
  },
  {
    slug: 'pendulum',
    name: 'Pendulum Simulator',
    category: 'physics',
    description: 'Visualize simple harmonic motion with a live animated pendulum and period readout.',
    component: 'PendulumSim',
    status: 'live',
    tags: ['Motion', 'Physics', 'Simulator'],
    seoTitle: 'Pendulum Simulator — Interactive Simple Pendulum Physics Tool',
    seoDescription:
      'Explore pendulum motion with an interactive simple pendulum simulator. Adjust length and gravity, view the period formula, and learn how pendulums work.',
    keywords: [
      'Pendulum Simulator',
      'simple pendulum simulator',
      'pendulum period calculator',
      'simple harmonic motion simulator',
      'pendulum formula',
      'calculate pendulum period',
    ],
    formula: {
      title: 'Pendulum period formula',
      expression: 'T = 2π√(L / g)',
      body:
        'The ideal simple pendulum formula estimates the period T, or the time for one complete swing. L is the pendulum length in meters and g is gravitational acceleration in m/s². For small angles, this formula is accurate enough to calculate pendulum period in many classroom examples.',
    },
    guide: [
      {
        heading: 'What is a simple pendulum?',
        body: [
          'A simple pendulum is a mass suspended from a fixed point by a light string or rod. Pull it to one side and gravity pulls it back toward the lowest point, creating a repeating swing.',
          'At small angles, a simple pendulum simulator can show motion that is close to simple harmonic motion. The restoring force grows as the pendulum moves away from the center, then pulls it back through equilibrium.',
        ],
      },
      {
        heading: 'What affects pendulum motion?',
        body: [
          'The main values that affect ideal pendulum motion are length, gravity, and starting angle. Length changes how far the bob travels along its arc. Gravity changes how strongly it is pulled back toward the center.',
          'Friction and air resistance matter in real life, but the basic pendulum formula usually starts with an ideal model so the relationship is easier to see.',
        ],
      },
      {
        heading: 'Length vs period',
        body: [
          'Length has the clearest effect on period. A longer pendulum swings more slowly, while a shorter pendulum swings more quickly. Because the formula uses a square root, making the pendulum four times longer doubles the period.',
          'For example, a 1 m pendulum on Earth has a period of about 2.01 seconds. A 0.25 m pendulum has a period of about 1.00 second.',
        ],
      },
      {
        heading: 'Does mass affect pendulum period?',
        body: [
          'In the ideal simple pendulum model, mass does not significantly affect the period. A heavy bob and a light bob with the same length should swing with the same period if friction and air resistance are ignored.',
          'That result can feel surprising, which is why changing values in a pendulum period calculator is helpful. Length and gravity change the timing; mass is not part of the small-angle period formula.',
        ],
      },
      {
        heading: 'How to use this simulator',
        body: [
          'Adjust the pendulum length and gravity, then watch how the animation and period readout respond. Use small starting angles when you want the motion to match the standard pendulum formula closely.',
          'Try changing one value at a time. That makes it easier to see whether the period changed because of length, gravity, or a larger starting angle.',
        ],
      },
    ],
    examples: [
      {
        title: 'Calculate pendulum period on Earth',
        body: 'For L = 1 m and g = 9.81 m/s², T = 2π√(1 / 9.81), which is about 2.01 seconds.',
      },
      {
        title: 'Short classroom pendulum',
        body: 'For L = 0.25 m on Earth, the period is about 1.00 second. Shortening the length makes the pendulum swing faster.',
      },
      {
        title: 'Same pendulum, weaker gravity',
        body: 'For L = 1 m and Moon gravity near 1.62 m/s², the period is about 4.94 seconds.',
      },
    ],
    faqs: [
      {
        question: 'Is this a simple harmonic motion simulator?',
        answer:
          'For small starting angles, the pendulum is a good approximation of simple harmonic motion. At larger angles, the motion still repeats, but the simple formula becomes less exact.',
      },
      {
        question: 'How do I calculate pendulum period?',
        answer:
          'Use T = 2π√(L / g), where L is length and g is gravity. Enter those values in the simulator to compare the formula with the live motion.',
      },
      {
        question: 'Why does mass not appear in the pendulum formula?',
        answer:
          'In the ideal model, the gravitational force and inertia both scale with mass, so mass cancels out. That is why length and gravity control the period instead.',
      },
    ],
    relatedTools: [
      {
        label: 'Lens Formula Simulator',
        href: '/tools/lens-formula-simulator',
        description: 'Explore another physics simulation for image distance, magnification, and thin lenses.',
      },
      {
        label: "Ohm's Law Calculator",
        href: '/tools/ohms-law',
        description: 'Explore another interactive STEM tool for voltage, current, and resistance.',
      },
    ],
    icon: '🔵',
  },
  {
    slug: 'lens-formula-simulator',
    name: 'Lens Formula Simulator',
    category: 'physics',
    description:
      'Calculate image distance, magnification, and image height using the thin lens equation for convex and concave lenses.',
    component: 'LensFormulaSimulator',
    status: 'live',
    tags: ['Optics', 'Lens', 'Physics', 'Simulator'],
    seoTitle: 'Lens Formula Simulator — Interactive Thin Lens Equation Calculator',
    seoDescription:
      'Use this interactive lens formula simulator to calculate image distance, magnification, and image height for convex and concave lenses using the thin lens equation.',
    keywords: [
      'Interactive Lens Formula Simulator',
      'lens formula simulator',
      'thin lens equation calculator',
      'lens equation calculator',
      'convex lens simulator',
      'concave lens simulator',
      'image distance calculator',
      'magnification calculator',
      'optics simulator',
    ],
    formula: {
      title: 'Thin lens equation',
      expression: '1/f = 1/v + 1/u',
      body:
        'The thin lens equation relates focal length f, object distance u, and image distance v. In this simulator, students enter object distance as a positive distance from the lens. Convex lenses use positive focal length, concave lenses use negative focal length, and the calculator solves v = 1 / (1/f - 1/u).',
    },
    guide: [
      {
        heading: 'What is the lens formula?',
        body: [
          'The lens formula describes where an image forms when light from an object passes through a thin lens. It is a compact model for classroom optics problems, camera lenses, magnifying glasses, and basic ray diagrams.',
          'This lens formula simulator turns the equation into an interactive optics simulator. Change the lens type, focal length, object distance, or object height, and the diagram updates so the calculated image position is easier to understand.',
        ],
      },
      {
        heading: 'Convex lens vs concave lens',
        body: [
          'A convex lens has a positive focal length and can form a real inverted image when the object is beyond the focal point. If the object is inside the focal length, the image becomes virtual and upright.',
          'A concave lens has a negative focal length. For a real object in this beginner-friendly convention, it generally forms a virtual, upright, diminished image on the same side as the object.',
        ],
      },
      {
        heading: 'How to calculate image distance',
        body: [
          'Start with 1/f = 1/v + 1/u. Rearranging gives v = 1 / (1/f - 1/u). This page works as an image distance calculator by solving that expression whenever the inputs change.',
          'If a convex lens has f = 10 cm and the object is u = 30 cm away, then v = 1 / (1/10 - 1/30) = 15 cm. The image forms on the opposite side of the lens.',
        ],
      },
      {
        heading: 'What is magnification?',
        body: [
          'Magnification compares image height with object height. This simulator uses m = -v / u. A negative magnification means the image is inverted, while a positive magnification means the image is upright.',
          'The tool also works as a magnification calculator because image height is calculated from image height = magnification × object height.',
        ],
      },
      {
        heading: 'Real vs virtual image',
        body: [
          'A real image forms where light rays actually meet and can be projected onto a screen. In the diagram, real images appear on the opposite side of the lens from the object.',
          'A virtual image forms where rays appear to come from. In the diagram, virtual images appear on the same side as the object and use a dashed arrow so the image type is not communicated by color alone.',
        ],
      },
      {
        heading: 'Common mistakes',
        body: [
          'The most common mistake is mixing sign conventions. This simulator keeps object distance positive for beginner usability, then applies positive focal length for convex lenses and negative focal length for concave lenses.',
          'Another common mistake is ignoring the focal point edge case. When the object distance equals the focal length for a convex lens, the image forms at infinity, so the page shows a friendly message instead of a broken number.',
        ],
      },
    ],
    examples: [
      {
        title: 'Convex lens beyond the focal point',
        body: 'With f = 10 cm and u = 30 cm, the image distance is 15 cm. The magnification is -0.5, so the image is real, inverted, and diminished.',
      },
      {
        title: 'Convex lens at the focal point',
        body: 'With f = 10 cm and u = 10 cm, the denominator becomes zero. The image forms at infinity instead of at a finite screen distance.',
      },
      {
        title: 'Concave lens',
        body: 'With f = -10 cm and u = 30 cm, the image distance is negative. The image is virtual, upright, and diminished.',
      },
    ],
    faqs: [
      {
        question: 'Is this a thin lens equation calculator?',
        answer:
          'Yes. It calculates image distance, magnification, and image height from the thin lens equation 1/f = 1/v + 1/u.',
      },
      {
        question: 'What sign convention does this lens equation calculator use?',
        answer:
          'Object distance is entered as positive for beginner usability. Convex focal length is positive, concave focal length is negative, and magnification is m = -v / u.',
      },
      {
        question: 'Why does the image go to infinity?',
        answer:
          'For a convex lens, an object at the focal point sends outgoing rays parallel to each other. The image distance is not finite, so the simulator reports that the image forms at infinity.',
      },
      {
        question: 'Can I use it as a convex lens simulator and concave lens simulator?',
        answer:
          'Yes. Use the lens type control to switch between convex and concave behavior, then compare how the image position and orientation change.',
      },
    ],
    relatedTools: [
      {
        label: 'Pendulum Simulator',
        href: '/tools/pendulum',
        description: 'Try another physics simulation for motion, gravity, and simple harmonic behavior.',
      },
    ],
    icon: '🔍',
  },
]

export function getToolBySlug(slug: string): ToolEntry | undefined {
  return tools.find((t) => t.slug === slug)
}

export function getLiveTools(): ToolEntry[] {
  return tools.filter((t) => t.status === 'live')
}
