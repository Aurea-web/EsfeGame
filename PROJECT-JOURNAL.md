# Project Journal: Operación Anti Procrastinación

## Entry 01 — Project format

- **Runtime:** Expo SDK 58, React Native 0.88, React 19, and TypeScript in `.tsx` and `.ts` files.
- **Targets:** iOS, Android, and web; the app is configured for landscape orientation.
- **Startup:** [`App.tsx`](./App.tsx) loads the Fredoka and Pixelify Sans fonts, configures audio, and locks native devices to landscape. [`src/navigation/index.tsx`](./src/navigation/index.tsx) defines the Home → Levels → CharacterSelect → Game → Win/Lose flow.
- **Persistence:** [`src/services/LevelProgress.ts`](./src/services/LevelProgress.ts) saves the highest completed level in AsyncStorage. Levels unlock in order.

## Entry 02 — Screens and button behavior

| Screen / control | Behavior and conditions |
| --- | --- |
| Home — **Niveles** | Navigates to the level list. |
| Home — **Créditos** | Opens the credits alert. |
| Levels — level card | Starts that level when unlocked. The next level unlocks after completing the previous one; saved progress is reloaded whenever the screen regains focus. |
| Levels — **Reintentar** | Retries loading saved progress if the storage read failed. |
| Game — left/right touch controls | Hold to move; releasing stops horizontal movement. The direction uses fixed horizontal velocity. |
| Game — jump | Jumps only while grounded; jump input while airborne is ignored. |
| Game — pause icon | Pauses the simulation, countdown, and background track. |
| Pause — **Reanudar** | Resumes the game and plays the pause sound. |
| Pause — **Salir** | Returns to the level list. |
| Pause — **Repetir** | Resets the current world, score, and 120-second timer. |
| Win — **Menú** | Returns to the level list after progress saving finishes. |
| Win — **Siguiente nivel** | Appears after a successful save, except after the final level; loads the next level. |
| Lose — **MENÚ** | Returns to the level list. |
| Lose — **REPETIR** | Replaces the result screen with a fresh run of the same level. |

Game controls and screen UI are implemented in React Native components rather than browser buttons.

## Entry 03 — Rules and state transitions

- A run starts with **120 seconds** and **0 points**. The timer stops while the game is paused.
- Collecting a coin adds **10 points** and plays the coin pickup sound. A collected coin is hidden and cannot score again.
- Touching the door wins the level. Winning records the score, remaining-time concentration, and level, then replaces the game screen with the win screen.
- Concentration begins at 100% and decreases linearly with elapsed time, reaching 0% at timeout. Its HUD color changes from green to yellow to red as it falls.
- **Failure condition:** the timer reaching 0 or colliding with any of the three floating-bed enemies ends the run and opens the defeat screen with the final score and current level. A shared end-of-run guard prevents competing events from navigating to both result screens.
- Completing levels is persisted in order. Progress read/write errors are surfaced in the level and win screens with retry feedback.

## Entry 04 — Physics and world objects

- [`src/services/GameState.ts`](./src/services/GameState.ts) builds each world with Matter.js. Gravity is `1.5` with a gravity scale of `0.001`.
- The player is a **58 × 58** physics rectangle with low friction, low air friction, and no bounce. The rendered player uses a **104 px** sprite viewport.
- [`src/services/GameControls.ts`](./src/services/GameControls.ts) sets horizontal velocity to **−6 / +6** and jump velocity to **−9**. Ground contact is tracked per collision pair; jumping requires at least one valid ground/platform contact and does not trigger during a strong upward jump.
- The static ground spans the world. Ten positions are placed across it with coins above them: seven static platforms and three vertically patrolling floating-bed platforms with coins. Unscored stepping platforms bridge wide horizontal or vertical gaps in the main route and level 1 parkour route. Players can land on the beds or jump up through them; colliding with a bed from the side still ends the run. Level 1 additionally creates six ascending parkour platforms with coins. The goal door is positioned over the last position. Side walls bound the world.
- [`src/components/GameScene.tsx`](./src/components/GameScene.tsx) advances Matter.js in steps capped at about **16.6 ms**, moves each enemy, then runs collision handling. [`src/components/GameWorldRenderer.tsx`](./src/components/GameWorldRenderer.tsx) follows the player with a camera over the larger world.
- [`src/entities/Player.tsx`](./src/entities/Player.tsx) switches between idle, walking, and jumping sprite sheets; facing direction and the selected character determine which sheet is shown. Levels open a character selector before the game, and retries / next-level play retain that choice.
- [`src/entities/Ground.tsx`](./src/entities/Ground.tsx), [`src/entities/Coin.tsx`](./src/entities/Coin.tsx), and [`src/entities/Door.tsx`](./src/entities/Door.tsx) render the ground/platform texture, collectible, and goal. `Enemy.tsx` renders the three floating beds that patrol vertically; landing on them is safe, but side contact ends the run.

## Entry 05 — Scenery, art, and sound

- Level 1 uses [`assets/La cama.jpg`](./assets/La%20cama.jpg) and level 2 uses [`assets/level2bus.jpeg`](./assets/level2bus.jpeg) as their backgrounds; platform and ground surfaces use [`assets/SueloPrincipalPixel.png`](./assets/SueloPrincipalPixel.png).
- Player animation assets: the female sprite set (`Idle.png`, `Walk.png`, `Walk_izquierda.png`, and both `Salto_Femenino_*.png` sheets) and the male sprite set (`Male_Idle.png`, `Male_Walk*.png`, and both `Male_Jump_*.png` sheets).
- The three floating-bed enemies use `assets/camaflotante.png`.
- Other visual assets include the app icons, splash icon, favicon, and `assets/fonts/Fredoka.ttf` / `assets/fonts/PixelifySans.ttf`.
- Audio is managed from [`src/screens/GameScreen.tsx`](./src/screens/GameScreen.tsx): `levelbackgroundmusic.mpeg` loops during play; `walking.mpeg` loops while moving; `menu_pause .mpeg` plays on pause/resume; and `coinpickup.mpeg` plays when collecting a coin. `winlevel.mpeg` plays on the win screen. There is no separate defeat sound asset wired in currently.
- The defeat screen follows the supplied reference: dark purple neon/pixel atmosphere, Spanish defeat message, zero-padded score, blue menu button, and green retry button. These are native-rendered elements rather than a screenshot of the reference.

## Entry 06 — JavaScript, HTML, and CSS notes

- The application logic is JavaScript-based TypeScript. `.tsx` files return JSX and `.ts` files hold services/systems; TypeScript strict mode is enabled.
- There are no standalone `.html` or `.css` files in this app. The UI tree is JSX rendered by React Native, and visual rules are mostly `StyleSheet.create` objects in `src/styles/` or inline component styles.
- Expo web renders these components through React Native Web. A few existing screens use `backgroundImage` gradients for web-oriented glow effects; the new defeat screen uses Expo `LinearGradient` and standard React Native styles for a cross-platform background.
- Game simulation and rendering are separated: screens coordinate state and navigation, components compose the UI, services build state/provide controls, systems update physics/collisions, and entities render world objects.

## Entry 07 — Legacy JSON character scripting (further reading)

The character sprites are selected by TypeScript in `src/entities/PlayerSprites.ts`; the following legacy-style JSON manifest is a reference for how the same data could be described outside the code. It is documentation only and is not loaded by the current app.

```json
{
  "schemaVersion": 1,
  "characters": {
    "male": {
      "label": "Chico",
      "sprites": {
        "idle": "assets/Male_Idle.png",
        "walkRight": "assets/Male_Walk.png",
        "walkLeft": "assets/Male_Walk_izquierda.png",
        "jumpRight": "assets/Male_Jump_Derecha.png",
        "jumpLeft": "assets/Male_Jump_Izquierda.png"
      },
      "frames": {
        "idle": 1,
        "walk": 12,
        "jump": 12
      }
    },
    "female": {
      "label": "Chica",
      "sprites": {
        "idle": "assets/Idle.png",
        "walkRight": "assets/Walk.png",
        "walkLeft": "assets/Walk_izquierda.png",
        "jumpRight": "assets/Salto_Femenino_Derecha.png",
        "jumpLeft": "assets/Salto_Femenino_Izquierda.png"
      },
      "frames": {
        "idle": 9,
        "walk": 12,
        "jump": 12
      }
    }
  }
}
```

In a legacy data-driven setup, the selector would persist the chosen character key and the renderer would resolve the corresponding sprite paths and frame counts from this manifest. The active implementation uses static `require()` references so Metro can bundle the image assets reliably across iOS, Android, and web.

## Entry 08 — Sprite paths, dependencies, dimensions, and world placement

### Asset path resolution and selection flow

`src/entities/PlayerSprites.ts` is the canonical sprite registry. Each `require("../../assets/...")` path is relative to that TypeScript file: go up from `src/entities/` to the project root, then into `assets/`. These are Metro static asset references, not runtime filesystem paths; keep the file names literal in `require()` calls so the bundler can discover and package them. The strings in Entry 07's legacy JSON are project-root-relative documentation paths, not imports.

The runtime selection path is:

1. `src/screens/LevelScreen.tsx` navigates to `CharacterSelect` with the selected level and title.
2. `src/screens/CharacterSelectScreen.tsx` selects the `male` or `female` key and passes it to `Game`.
3. `src/screens/GameScreen.tsx` normalizes the route value to a supported key and passes it to `GameScene`.
4. `src/components/GameScene.tsx` supplies the character to `GameWorldRenderer`; the renderer passes it only to the player entity.
5. `src/entities/Player.tsx` indexes `playerSprites[character]` and picks idle, walk-left/right, or jump-left/right based on velocity and facing direction.
6. Win/loss route parameters keep the key available to retry or start the next level. If a route has no recognized key, gameplay defaults to `female`.

The selector portrait uses each character's `preview` require. `Male_Idle.png` and `Female_Idle.png` are one-frame preview files cropped from the first source frame; they are not new gameplay animations.

### Sprite styling dependencies and frame math

The sprite rendering dependency chain is:

| Layer | Responsibility / dependency |
| --- | --- |
| `PlayerSprites.ts` | `PlayerCharacter` union type, `ImageSourcePropType`, static image requires, and idle/walk/jump frame counts. |
| `Player.tsx` | Reads the Matter body, determines animation state and facing, advances the frame, and renders the selected sprite sheet in an `Image`. |
| `PlayerStyles.ts` | Defines the shared viewport and exports `getSpriteSheetStyle(frame, frameCount)` plus the world-to-player position style. |
| `GameWorldRenderer.tsx` | Provides the character key and facing state to the player renderer while other entity renderers receive only their own entity data. |
| React Native | `Image`, `View`, `StyleSheet`, `ImageStyle`, `ViewStyle`, and `ImageSourcePropType` provide the cross-platform display and styling primitives. |
| Expo / Metro | Bundles the static `require()` image references for native and web targets; no sprite-loading package is used. |

`playerFrameSize = 104` is the displayed square viewport size in React Native layout units (density-independent points on native screens; CSS pixels on web). The source sheets use 128 × 128 pixel frames. `resizeMode="stretch"` maps each current 128-pixel source frame into the 104-unit viewport; it is a display scale, not a change to the source file.

For frame index `f` and animation frame count `N`:

```text
viewportWidth  = 104
sheetImageWidth = 104 * N
sheetTranslateX = -104 * f
sheetImageHeight = 104
0 <= f < N
```

The viewport clips the translated sheet using `overflow: "hidden"`. Idle advances every 140 ms; walking and jumping advance every 90 ms. Male idle has one frame, female idle has nine, and both characters use twelve-frame walking and jumping sheets. In other words, the display cadence is about `1000 / intervalMs` frame steps per second (approximately 7.14 idle or 11.11 movement steps per second), with the final visual rate also bounded by React rendering.

### Source pixel resolutions

The following are source image pixel dimensions, read from the bundled asset files. They are distinct from the world-body dimensions and the on-screen React Native dimensions.

| Asset(s) | Source pixel dimensions | Notes |
| --- | ---: | --- |
| `assets/Idle.png` | 1152 × 128 | Female idle sheet: 9 × 128-pixel frames. |
| `assets/Walk.png`, `assets/Walk_izquierda.png` | 1536 × 128 each | Female walking: 12 frames per direction. |
| `assets/Salto_Femenino_Derecha.png`, `assets/Salto_Femenino_Izquierda.png` | 1536 × 128 each | Female jump: 12 frames per direction. |
| `assets/Male_Walk.png`, `assets/Male_Walk_izquierda.png` | 1536 × 128 each | Male walking: 12 frames per direction. |
| `assets/Male_Jump_Derecha.png`, `assets/Male_Jump_Izquierda.png` | 1536 × 128 each | Male jump: 12 frames per direction. |
| `assets/Male_Idle.png`, `assets/Female_Idle.png` | 128 × 128 each | Single-frame selector portraits. |
| `assets/SueloPrincipalPixel.png` | 512 × 128 | Ground/platform texture, repeated to fill its display box. |
| `assets/camaflotante.png` | 219 × 166 | Floating-bed image; renderer preserves its source aspect ratio. |
| `assets/puertanivel.png` | 183 × 192 | Door image; renderer stretches it to the configured display box. |
| `assets/La cama.jpg` | 1584 × 672 | Level 1 background; rendered with `cover` in a viewport-height-relative box. |

### World coordinates, object-relative placement, and physics formulas

The formulas below follow `src/services/GameState.ts`; `W` and `H` mean the current window dimensions sampled by `Dimensions.get("window")`. World and Matter coordinates are game-space units (treated visually as pixels), not physical meters.

```text
worldWidth  = max(3 * W, W + 600)
worldHeight = max(1.35 * H, 420)
groundY     = worldHeight - 58
```

Matter uses positive Y downward. The main ground body is centered at `(worldWidth / 2, groundY)` with dimensions `worldWidth × 58`, so its top edge is `groundY - 29`. The player body is `58 × 58`, starts centered at `(100, groundY - 59)`, and its sprite container is positioned at:

```text
playerViewLeft = playerBody.position.x - 104 / 2
playerViewTop  = playerBody.position.y - (104 - 29)
```

That vertical formula aligns the sprite's nominal feet with the bottom portion of its physics body (`playerBody.position.y + 29`). Collision bounds are still the 58 × 58 Matter rectangle; transparent sprite pixels do not change physics.

The ten main platform center X coordinates use index `i = 0..9`:

```text
platformX(i) = 170 + ((worldWidth - 340) / 9) * i
platformY(i) = groundY - platformHeights[i]
platformHeights = [105, 155, 125, 180, 145, 195, 160, 210, 175, 225]
```

Seven regular platforms use `150 × 20` static bodies. The three enemy-bed platform bodies (indices 1, 4, and 7) use `90 × 64`. Each main coin is centered at `(platformX, platformY - 35)` with a Matter radius of 10. Level 1's six extra parkour platforms are at `x = [0.43, 0.49, 0.55, 0.61, 0.67, 0.73] * worldWidth`; their heights above the ground are `[70, 115, 160, 205, 250, 295]`, and each is `110 × 20`. Their coins are centered `38` world units above their platform center.

Access platforms between successive route points use linear interpolation. Let `startX`, `endX` be endpoint X values and `startTopHeight`, `endTopHeight` be endpoint top heights:

```text
segmentLength = endX - startX
stepCount = max(
  ceil(segmentLength / 160),
  ceil(abs(endTopHeight - startTopHeight) / 40)
)
progress(j) = j / stepCount,  where j = 1..stepCount-1
x(j) = startX + segmentLength * progress(j)
y(j) = groundY - (
  startTopHeight
  + (endTopHeight - startTopHeight) * progress(j)
  - 10
)
accessPlatformBody = 130 × 20, static
```

Enemy patrol bounds are centered around each enemy platform's initial Y:

```text
patrolMinY = initialY - 40
patrolMaxY = initialY + 40
deltaMs = clamp(time.delta || 16.6, 1, 16.6)
nextY = currentY + 75 * (deltaMs / 1000) * patrolDirection
```

At either bound, the system clamps `nextY` to that bound and reverses `patrolDirection`. The renderer moves the Matter body; the bed image is centered on that body's current position.

Player movement sets `velocity.x` to `-6` or `+6`, while preserving `velocity.y`. Jump sets `velocity.y` to `-9`, preserving `velocity.x`, and only does so when the collision system has a valid ground/platform contact and the player is not already moving upward faster than `0.75` (that is, `velocity.y < -0.75`). Releasing horizontal input sets X velocity to zero but preserves Y. These are Matter velocity units per engine update, not calibrated SI speeds. Initial Matter setup is `gravity.y = 1.5`, `gravity.scale = 0.001`; player material values are `friction = 0.05`, `frictionAir = 0.005`, `frictionStatic = 0`, and `restitution = 0`. The scene caps each engine update at 16.6 ms.

The door sensor is centered at the last main platform's center X and 55 units above its center Y; its Matter body is `50 × 80`. Two static side walls are `40 × worldHeight`, centered at `x = -20` and `x = worldWidth + 20`, with Y center `worldHeight / 2`.

### Render sizes, camera, layering, and display state

| Object / UI | Physics or layout size | Rendered state and relative alignment |
| --- | --- | --- |
| Player | Matter rectangle `58 × 58`; sprite viewport `104 × 104` | Body position anchors the sprite using the formulas above. Player is sorted after other world entities so it draws on top. |
| Main regular platform / ground | Bodies: `150 × 20` for a platform; main ground `worldWidth × 58` | [`Ground.tsx`](./src/entities/Ground.tsx) sizes its absolute `View` from `body.bounds`; the 512 × 128 surface image repeats over the full box. |
| Enemy bed | Collision body `90 × 64` | [`Enemy.tsx`](./src/entities/Enemy.tsx) renders at `100 × (100 * 166 / 219)` units (about `100 × 75.8`), centered over the moving body. Visual art is intentionally larger than its collision rectangle. |
| Coin | Matter sensor circle radius `10` (20 diameter) | [`Coin.tsx`](./src/entities/Coin.tsx) draws a gold `20 × 20` circle at `body.position - (10, 10)`; renderer returns `null` after its label changes from `coin`. |
| Exit door | Matter sensor `50 × 80` | [`Door.tsx`](./src/entities/Door.tsx) draws `76 × 96`, centered on the sensor body. |
| Level backgrounds | No collision body | Levels 1 and 2 select their bundled image in `GameWorldRenderer.tsx`. `ImageBackground` covers the viewport with `resizeMode="cover"` in a box of viewport width × 120% viewport height, bottom aligned; other levels omit the image. |
| HUD | Layout-driven | Positioned at top 16 / left 16 / right 80 with z-index 100; score is top 60 / left 20. Concentration fill width is the concentration percentage. |
| Touch controls | Three `70 × 70` buttons | Container is bottom 12, left/right 12, height 76, z-index 120; left/right share a row, jump is on the opposite side. |
| Idle speech bubble | Width 152, horizontally centered over the 104-unit sprite; bottom `104 + 4` | Rendered only when horizontal movement and jump thresholds indicate idle. It is presentation only and has no collision body. |

The camera follows the player but clamps to the world edges. For viewport size `(layout.width, layout.height)`:

```text
cameraX = clamp(playerX - 0.4 * layout.width, 0, worldWidth - layout.width)
cameraY = clamp(playerY - 0.48 * layout.height, 0, worldHeight - layout.height)
worldContent.left = -cameraX
worldContent.top  = -cameraY
```

`clamp(value, min, max)` means `max(min, min(value, max))`. The world viewport clips the translated content. The game engine runs only while `isPaused` is false; the timer and music are likewise paused by game state. Controls render above the game world, while the level background is behind the translated entities.

## Entry 08 — Change log: level 2 background and mobile viewport

- **2026-11-05 — Level 2 bus background:** Added the supplied bus interior image as `assets/level2bus.jpeg`. `src/components/GameWorldRenderer.tsx` chooses the level 1 or level 2 image from the level number and renders it behind the game entities. Levels without a configured image keep the existing plain viewport background.
- **JavaScript/TypeScript implementation:** The background source is selected with static asset `require` calls, so Metro can bundle both images for native and web builds. The image remains presentation-only and does not change world dimensions, physics, or camera movement.
- **Mobile styling and resolution:** Reuses `levelBackground` and `levelBackgroundImage` from `src/styles/GameScreenStyles.ts`. Their percentage dimensions respond to the game viewport on mobile screens; `resizeMode="cover"` fills it while preserving the image's aspect ratio, and the 120%-height, bottom-aligned container retains the existing landscape composition. The game viewport clips overflow, leaving the HUD, entities, and touch controls layered above the background.
