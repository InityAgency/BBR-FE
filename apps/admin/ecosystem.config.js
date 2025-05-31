module.exports = {
  apps: [
    {
      name: "admin-app",
      cwd: "./", // PM2 će iz ovog foldera pokretati `next start`
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3004",
      exec_mode: "cluster",
      instances: "max",
      watch: false,
      // nema env_production, jer Next.js čita apps/admin/.env
    },
  ],
};
