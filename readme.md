# EventEase

Application mobile d'organisation d'évènements (exercice, non destinée au déploiement), construite avec **React Native + Expo (SDK 57) et TypeScript**.

- **Navigation** : React Navigation (stack + onglets), sans expo-router. Les écrans sont déclarés **conditionnellement** selon `user` : la connexion ou la déconnexion change la navigation sans aucun `navigate` manuel.
- **État global** : trois Context (`ThemeContext`, `AuthContext`, `EventsContext`), chacun avec son hook (`useTheme`, `useAuth`, `useEvents`) qui signale un oubli de Provider.
- **Persistance** : AsyncStorage derrière un petit wrapper JSON typé. Les fichiers `data/*.json` alimentent le stockage au premier lancement (`seed`), qui n'écrase jamais des données existantes.
- **Thème** : palettes claire et sombre avec les mêmes clés (`darkColors: typeof lightColors`), police Tuffy, aucun style de couleur en dur dans les composants. Le choix est mémorisé.
- **Accessibilité** : contrastes visés WCAG AA, libellés et rôles d'accessibilité, état jamais transmis par la couleur seule.
- **Rôles et droits** : `admin`, `member` et `volunteer`. Seuls admin et member créent, modifient et suppriment **leurs propres** évènements. Les règles sont centralisées dans `utils/permissions.ts` et vérifiées à la fois dans l'interface et dans le contexte.
- **Données** : tous les `id` sont des `string`. L'inscription d'un utilisateur est **calculée** à partir de `participantIds`, pas stockée dans l'évènement.
- **Composants** : `Button`, `Input`, `Screen` (zone sûre, clavier, barre de statut) et `EventCard` (qui reçoit des props, sans état propre).
  **Structure** : `src/{components, context, data, hooks, navigation, screens, storage, theme, types, utils}`.

**Lancer le projet** : `npm install` puis `npx expo start` (`-c` pour vider le cache). Comptes de test dans `src/data/users.json`.
