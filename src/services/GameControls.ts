import Matter from "matter-js";

const groundContacts = new WeakMap<Matter.Body, Set<string>>();

export const setGroundContact = (
  player: Matter.Body,
  contactId: string,
  isTouching: boolean
) => {
  let contacts = groundContacts.get(player);

  if (!contacts) {
    contacts = new Set();
    groundContacts.set(player, contacts);
  }

  if (isTouching) {
    contacts.add(contactId);
  } else {
    contacts.delete(contactId);
    if (contacts.size === 0) groundContacts.delete(player);
  }
};

export const moveLeft = (player: Matter.Body) => {
  Matter.Body.setVelocity(player, {
    x: -6,
    y: player.velocity.y,
  });
};

export const moveRight = (player: Matter.Body) => {
  Matter.Body.setVelocity(player, {
    x: 6,
    y: player.velocity.y,
  });
};

export const jump = (player: Matter.Body) => {
  if (!groundContacts.get(player)?.size || player.velocity.y < -0.75) return;

  Matter.Body.setVelocity(player, {
    x: player.velocity.x,
    y: -8.5,
  });
};