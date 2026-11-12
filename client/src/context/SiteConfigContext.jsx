import { createContext, useContext } from 'react';
import { siteConfig } from '../lib/config';

const Ctx = createContext(siteConfig);
export const SiteConfigProvider = ({ children }) => <Ctx.Provider value={siteConfig}>{children}</Ctx.Provider>;
export const useSiteConfig = () => useContext(Ctx);
