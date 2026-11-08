# Scripting Archive

This archive is a standalone, journal-style reference for how gameplay is
scripted. It complements `PROJECT-JOURNAL.md` without adding another entry to
that project journal.

## Entry 01 — The gameplay loop

The game is built from React Native screens and components, with Matter.js
handling the physics simulation. The main runtime path is:

1. [`src/screens/GameScreen.tsx`](./src/screens/GameScreen.tsx) creates a run,
   tracks the timer, score, health, and pause state, and handles game events.
2. [`src/services/GameState.ts`](./src/services/GameState.ts) creates the
   Matter.js engine, player, ground, and world dimensions. It asks the level
   registry for a level-specific world, falling back to the default world
   layout when no level factory is registered.
3. [`src/components/GameScene.tsx`](./src/components/GameScene.tsx) advances
   physics, applies held movement, updates moving hazards, and runs collision
   handling while the game is active.
4. [`src/systems/CollisionSystem.ts`](./src/systems/CollisionSystem.ts)
   translates physics collisions into game events such as `coin-collected`,
   `enemy-hit`, `telefono-hit`, and `win`.
5. `GameScreen` responds to those events by updating the HUD or navigating to
   the win or loss screen.

## Entry 02 — Movement and jumping

[`src/services/GameControls.ts`](./src/services/GameControls.ts) is the
canonical home for player movement values and jump rules:

- Holding left or right sets horizontal velocity to `-6` or `+6`.
- Releasing movement stops horizontal motion while preserving vertical
  velocity.
- Jump velocity is `-9`; Matter.js coordinates increase downward.
- Jumping requires a tracked ground or platform contact. The jump is ignored
  while airborne.
- [`src/screens/GameScreen.tsx`](./src/screens/GameScreen.tsx) connects the
  mobile touch controls and the desktop arrow keys / space bar to these
  functions.

`GameScene` reapplies the active movement direction during simulation updates.
When changing movement behavior, keep the input handlers and simulation update
consistent. `src/systems/MovementSystem.ts` is a legacy touch-based system and
is not included in the active `GameScene` system list.

## Entry 03 — Level scripting

[`src/levels/index.ts`](./src/levels/index.ts) maps level numbers to factory
functions. A factory receives a [`LevelContext`](./src/levels/LevelTypes.ts)
with the engine, world, player, ground, and world dimensions, and returns the
entities used by the renderer.

- Level 2 is registered to [`src/levels/level2Bus.ts`](./src/levels/level2Bus.ts).
- Other levels currently use the default world setup in
  [`src/services/GameState.ts`](./src/services/GameState.ts).
- Matter bodies use labels such as `player`, `ground`, `platform`, `coin`,
  `enemy`, and `door`. Collision handling relies on these labels; use the
  existing labels when adding objects that should interact with game rules.
- The game loop and world renderer are shared by level factories, so new level
  layouts can add entities without duplicating screen navigation or input.

## Entry 04 — Characters and animation

[`src/entities/PlayerSprites.ts`](./src/entities/PlayerSprites.ts) is the
canonical sprite registry. It defines the supported `male` and `female`
characters, static image references, and each animation's frame count.
[`src/entities/Player.tsx`](./src/entities/Player.tsx) selects idle, walking,
or jumping art from the player's velocity and facing direction, then advances
the sprite-sheet frame.

Keep asset references as literal `require()` calls in the registry so Metro can
bundle them for native and web builds. The JSON character manifest in Entry 07
of `PROJECT-JOURNAL.md` is a legacy illustration only; the app does not load it.

## Entry 05 — Run rules and practical changes

`GameScreen` starts each run with 120 seconds. The collision system dispatches
events; the screen owns score, health, timer, pause, and result navigation.
Collected coins add 10 points. Touching the door wins; enemy contact or the
timer running out can end the run. Phone projectiles reduce health.

When extending a gameplay feature, trace it through the relevant layers:

1. Create or update the entity and its Matter body.
2. Give the body an appropriate collision label and add it to the level world.
3. Handle its collision in `CollisionSystem` and dispatch a descriptive event.
4. Respond to that event in `GameScreen` if it affects score, health, or
   navigation.
5. Render the entity through the existing world-rendering path.

This separation keeps level layout, physics, collision rules, rendering, and
screen state coordinated without putting all gameplay behavior in one file.
