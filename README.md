# Pylon V2

Next-gen Pylon, starting with transactional on-ramping.

## Set-up

`npm i` or `pnpm i`

**Note:** `pnpm` will not install prisma correctly, so you will need to run `pnpm run db:generate` before running `pnpm run dev`

## Getting Started Guide

### Pre-requisites:
* NodeJS >=20.11.1
* (recommended) [pnpm](https://pnpm.io/) >=8.15.4 OR npm >=10.2.4
     * On Mac suggest you [install using Homebrew](https://formulae.brew.sh/formula/pnpm)
* (recommended) [nvm](https://github.com/nvm-sh/nvm?tab=readme-ov-file)
    * On Mac suggest you [install using Homebrew](https://formulae.brew.sh/formula/nvm)
* Postgres
    * On Mac suggest using [Postgresapp](https://postgresapp.com/)
* Access to our [Railway.app](https://railway.app/) instance
 
### Installation
1. On your local machine, clone this repo: `git clone git@github.com:newdaojones/pylon-v2.git`
2. Copy `.env.example` to `.env`
3. Log into [Railway.app project]([https://railway.app/](https://railway.app/project/068640ee-91f7-4664-82d1-5d1ebecee1e8/service/2bf62a2e-6e2b-4f99-ab9e-b8c456211048/variables)) and open the *Variables* tab
4. Copy the value of each variable in Railway.app to your `.env`
5. Run the following setup scripts
    ```
    pnpm i
    pnpm run db:generate
    pnpm run db:dev  
    ```
6. Run the server `pnpm run dev`
