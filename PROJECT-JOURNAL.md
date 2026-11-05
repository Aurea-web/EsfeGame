# Project Journal: Operación Anti Procrastinación

## Entry 01 — Project format

- **Runtime:** Expo SDK 58, React Native 0.88, React 19, and TypeScript in `.tsx` and `.ts` files.
- **Targets:** iOS, Android, and web; the app is configured for landscape orientation.
- **Startup:** [`App.tsx`](./App.tsx) loads the Fredoka and Pixelify Sans fonts, configures audio, and locks native devices to landscape. [`src/navigation/index.tsx`](./src/navigation/index.tsx) defines the Home → Levels → Game → Win/Lose stack.
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
- [`src/entities/Player.tsx`](./src/entities/Player.tsx) switches between idle, walking, and jumping sprite sheets; facing direction determines which left/right sheet is shown.
- [`src/entities/Ground.tsx`](./src/entities/Ground.tsx), [`src/entities/Coin.tsx`](./src/entities/Coin.tsx), and [`src/entities/Door.tsx`](./src/entities/Door.tsx) render the ground/platform texture, collectible, and goal. `Enemy.tsx` renders the three floating beds that patrol vertically; landing on them is safe, but side contact ends the run.

## Entry 05 — Scenery, art, and sound

- Level 1 uses [`assets/La cama.jpg`](./assets/La%20cama.jpg) as its background; platform and ground surfaces use [`assets/SueloPrincipalPixel.png`](./assets/SueloPrincipalPixel.png).
- Player animation assets: `Idle.png`, `Walk.png`, `Walk_izquierda.png`, `Salto_Femenino_Derecha.png`, and `Salto_Femenino_Izquierda.png`.
- The three floating-bed enemies use `assets/camaflotante.png`.
- Other visual assets include the app icons, splash icon, favicon, and `assets/fonts/Fredoka.ttf` / `assets/fonts/PixelifySans.ttf`.
- Audio is managed from [`src/screens/GameScreen.tsx`](./src/screens/GameScreen.tsx): `levelbackgroundmusic.mpeg` loops during play; `walking.mpeg` loops while moving; `menu_pause .mpeg` plays on pause/resume; and `coinpickup.mpeg` plays when collecting a coin. `winlevel.mpeg` plays on the win screen. There is no separate defeat sound asset wired in currently.
- The defeat screen follows the supplied reference: dark purple neon/pixel atmosphere, Spanish defeat message, zero-padded score, blue menu button, and green retry button. These are native-rendered elements rather than a screenshot of the reference.

## Entry 06 — JavaScript, HTML, and CSS notes

- The application logic is JavaScript-based TypeScript. `.tsx` files return JSX and `.ts` files hold services/systems; TypeScript strict mode is enabled.
- There are no standalone `.html` or `.css` files in this app. The UI tree is JSX rendered by React Native, and visual rules are mostly `StyleSheet.create` objects in `src/styles/` or inline component styles.
- Expo web renders these components through React Native Web. A few existing screens use `backgroundImage` gradients for web-oriented glow effects; the new defeat screen uses Expo `LinearGradient` and standard React Native styles for a cross-platform background.
- Game simulation and rendering are separated: screens coordinate state and navigation, components compose the UI, services build state/provide controls, systems update physics/collisions, and entities render world objects.
