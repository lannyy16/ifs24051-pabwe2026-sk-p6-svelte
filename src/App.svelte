
<script>
  import { onMount } from 'svelte';
  import {
    currentPath,
    resolveRoute,
    navigate,
  } from './router.js';

  import AuthLayout from './features/auth/AuthLayout.svelte';
  import LoginPage from './features/auth/LoginPage.svelte';
  import RegisterPage from './features/auth/RegisterPage.svelte';

  import LinkTreeLayout from './features/linktrees/layouts/LinkTreeLayout.svelte';
  import HomePage from './features/linktrees/pages/HomePage.svelte';
  import DetailPage from './features/linktrees/pages/DetailPage.svelte';

  import UsersPage from './features/users/UsersPage.svelte';
  import ProfilePage from './features/users/ProfilePage.svelte';
  import NotFoundPage from './features/common/NotFoundPage.svelte';

  import { getToken } from './helpers/apiHelper.js';

  let route = $derived(resolveRoute($currentPath));

  onMount(() => {
    if (route.layout === 'app' && !getToken()) {
      navigate('/auth/login', { replace: true });
    }
  });
</script>

{#if route.layout === 'auth'}
  <AuthLayout>
    {#snippet children()}
      {#if route.page === 'login'}
        <LoginPage />
      {:else}
        <RegisterPage />
      {/if}
    {/snippet}
  </AuthLayout>
{:else if route.layout === 'app'}
  <LinkTreeLayout
    path={route.page === 'detail'
      ? '/link-trees/:linkTreeId'
      : route.page === 'home'
        ? '/'
        : `/${route.page}`}
  >
    {#snippet children()}
      {#if route.page === 'home'}
        <HomePage />
      {:else if route.page === 'detail'}
        <DetailPage id={route.linkTreeId} />
      {:else if route.page === 'users'}
        <UsersPage />
      {:else if route.page === 'profile'}
        <ProfilePage />
      {/if}
    {/snippet}
  </LinkTreeLayout>
{:else}
  <NotFoundPage />
{/if}
