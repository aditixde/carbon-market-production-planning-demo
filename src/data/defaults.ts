import { Parameters } from '../types';

export const TECHNOLOGY_NAMES = [
  'Coal-based Blast Furnace',
  'Electric Arc Furnace with Scrap',
  'Green Hydrogen with CCUS'
];

export const createDefaultParameters = (E: number, K: number, T: number): Parameters => {
  // Base values for scaling
  const baseFi = [10000, 12000];
  const baseCi = [
    [50, 60, 80],
    [55, 65, 85]
  ];
  const baseEi = [
    [2.2, 1.0, 0.5],
    [2.2, 1.0, 0.5]
  ];
  const baseWi = 1000;
  const baseYi = [1, 2, 3];
  const baseIci = [
    [10000, 15000, 20000],
    [11000, 16000, 21000]
  ];
  const baseAi = [1, 2, 3];
  const baseDi = [500, 600, 700, 800];
  const baseBeta = [2.0, 1.9, 1.8, 1.7];
  const basePt = [30, 32, 35, 38];
  const baseAi_alloc = [1000, 950, 900, 850];
  const baseHt = [1, 1.1, 1.2, 1.3];
  const baseOi = [50000, 55000, 60000, 65000];
  const baseBi = 10000;
  const baseSi = 10000;
  const baseScrapUse = [
    [0, 1, 0.5],
    [0, 1, 0.5]
  ];
  const baseCcusUse = [
    [0, 0, 1],
    [0, 0, 1]
  ];
  const baseSt = [2000, 2200, 2400, 2600];
  const baseUt = [1500, 1600, 1700, 1800];

  return {
    fi: Array.from({ length: E }, (_, i) => baseFi[i % baseFi.length]),
    ci: Array.from({ length: E }, (_, i) => 
      Array.from({ length: K }, (_, k) => baseCi[i % baseCi.length][k % baseCi[0].length])
    ),
    ei: Array.from({ length: E }, (_, i) => 
      Array.from({ length: K }, (_, k) => baseEi[i % baseEi.length][k % baseEi[0].length])
    ),
    wi: Array.from({ length: E }, () => 
      Array.from({ length: K }, () => baseWi)
    ),
    yi: Array.from({ length: E }, () => 
      Array.from({ length: K }, (_, k) => baseYi[k % baseYi.length])
    ),
    ici: Array.from({ length: E }, (_, i) => 
      Array.from({ length: K }, (_, k) => baseIci[i % baseIci.length][k % baseIci[0].length])
    ),
    ai: Array.from({ length: E }, () => 
      Array.from({ length: K }, (_, k) => baseAi[k % baseAi.length])
    ),
    di: Array.from({ length: E }, (_, i) => 
      Array.from({ length: T }, (_, t) => baseDi[t % baseDi.length])
    ),
    beta: Array.from({ length: T }, (_, t) => baseBeta[t % baseBeta.length]),
    pt: Array.from({ length: T }, (_, t) => basePt[t % basePt.length]),
    Ai: Array.from({ length: E }, (_, i) => 
      Array.from({ length: T }, (_, t) => baseAi_alloc[t % baseAi_alloc.length])
    ),
    ht: Array.from({ length: T }, (_, t) => baseHt[t % baseHt.length]),
    oi: Array.from({ length: E }, (_, i) => 
      Array.from({ length: T }, (_, t) => baseOi[t % baseOi.length])
    ),
    bi: Array.from({ length: E }, () => 
      Array.from({ length: T }, () => baseBi)
    ),
    si: Array.from({ length: E }, () => 
      Array.from({ length: T }, () => baseSi)
    ),
    scrapUse: Array.from({ length: E }, (_, i) => 
      Array.from({ length: K }, (_, k) => baseScrapUse[i % baseScrapUse.length][k % baseScrapUse[0].length])
    ),
    ccusUse: Array.from({ length: E }, (_, i) => 
      Array.from({ length: K }, (_, k) => baseCcusUse[i % baseCcusUse.length][k % baseCcusUse[0].length])
    ),
    St: Array.from({ length: T }, (_, t) => baseSt[t % baseSt.length]),
    Ut: Array.from({ length: T }, (_, t) => baseUt[t % baseUt.length]),
    pi: 1000,
    M: 1000000
  };
};