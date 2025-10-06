export interface Character {
  name: string;
  maxHP: number;
  currentHP: number;
  armorClass: number;
  passivePerception: number;
  resources: Resource[];
  consumers: Consumer[];
  specialRechargers: SpecialRecharge[];
}

export interface Resource {
  max: number;
  rechargeOnRest: 'short' | 'long';
  name: string;
}

export interface Consumer {
  name: string;
  resource: Resource['name'];
  cost: number;
}

export interface SpecialRecharge {
  name: string;
  resourceRecharged: Resource['name'];
  rechargeCount: number | 'max';
  resourceUsed?: Resource['name'];
  usedCount?: number;
}
