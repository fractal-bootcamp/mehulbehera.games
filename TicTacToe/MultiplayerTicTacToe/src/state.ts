import { atomWithStorage } from 'jotai/utils'


export const playerNameAtom = atomWithStorage('playerName', '')
export const currentGameID = atomWithStorage('currentGameID', '')

//add a game id
export const gameIDToAdd = atomWithStorage('gameIDToAdd', 35)