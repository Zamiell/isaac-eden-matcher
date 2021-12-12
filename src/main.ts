import { getStartSeedString, onSetSeed } from "isaacscript-common";

// Constants
const MOD_NAME = "isaac-seed-checker";
const VERBOSE = true;
const ACTIVE_COLLECTIBLE_TO_LOOK_FOR = CollectibleType.COLLECTIBLE_EDENS_SOUL;
// const PASSIVE_COLLECTIBLE_TO_LOOK_FOR = CollectibleType.COLLECTIBLE_TMTRAINER;
// const CARD_TO_LOOK_FOR = Card.CARD_CHAOS;

// Variables
let restartOnNextFrame = false;

export function main(): void {
  const mod = RegisterMod(MOD_NAME, 1);

  mod.AddCallback(ModCallbacks.MC_POST_RENDER, postRender); // 2
  mod.AddCallback(ModCallbacks.MC_POST_GAME_STARTED, postGameStarted); // 15

  Isaac.DebugString(`${MOD_NAME} initialized.`);
}

// ModCallbacks.MC_POST_RENDER (2)
function postRender() {
  if (restartOnNextFrame) {
    restartOnNextFrame = false;
    Isaac.ExecuteCommand("restart");
  }
}

// ModCallbacks.MC_POST_GAME_STARTED (15)
function postGameStarted(continued: boolean) {
  const startSeedString = getStartSeedString();

  if (VERBOSE) {
    Isaac.DebugString(
      `MC_POST_GAME_STARTED - ${startSeedString} - on set seed: ${onSetSeed()}`,
    );
  }

  if (!validateRun(continued)) {
    return;
  }

  const player = Isaac.GetPlayer();
  if (player.HasCollectible(ACTIVE_COLLECTIBLE_TO_LOOK_FOR)) {
    Isaac.DebugString(`GETTING HERE - ${startSeedString}`);
    return;
  }

  restartOnNextFrame = true;
}

function validateRun(continued: boolean) {
  const challenge = Isaac.GetChallenge();
  const player = Isaac.GetPlayer();
  const character = player.GetPlayerType();

  if (continued) {
    error(`The ${MOD_NAME} mod will not work when continuing a run.`);
  }

  if (challenge !== Challenge.CHALLENGE_NULL) {
    error(`The ${MOD_NAME} mod will not work on challenges.`);
  }

  if (character !== PlayerType.PLAYER_EDEN) {
    error(`The ${MOD_NAME} mod will not work on characters other than Eden.`);
  }

  if (onSetSeed()) {
    error(`The ${MOD_NAME} mod will not work on set seeds.`);
  }

  return true;
}
