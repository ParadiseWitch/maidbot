export interface HTTP {
  send: (action: string, params: any) => void,
}

export interface WS {
  send: (action: string, params: any) => void,
  listen: (callback: (arg0: any) => void) => void,
}