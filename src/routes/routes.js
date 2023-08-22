export default [
  {
    path: '/documents/:status',
    component: () => import('@/pages/document-page'),
    props: route => ({ status: route.params.status }),
    name: 'documents',
    meta: {
      auth: true,
      group: 'documents'
    }
  },
  {
    path: '/view-document/:id',
    component: () => import('@/pages/view-document-page'),
    props: route => ({ id: route.params.id }),
    name: 'view-document',
    meta: {
      auth: true,
      group: 'documents'
    }
  },
  {
    path: '/incoming-documents/:tab',
    component: () => import('../pages/incoming-document-page'),
    props: route => ({ tab: route.params.tab }),
    name: 'incoming-documents',
    meta: {
      auth: true,
      group: 'myDocuments'
    }
  },
  {
    path: '/sent-documents',
    component: () => import('@/pages/sent-document-page'),
    name: 'sent-documents',
    meta: {
      auth: true,
      group: 'documents'
    }
  },
  {
    path: '/signed-documents',
    component: () => import('../pages/signed-document-page'),
    name: 'signed-documents',
    meta: {
      auth: true,
      group: 'myDocuments'
    }
  },
  {
    path: '/draft-documents',
    component: () => import('@/pages/draft-document-page'),
    name: 'draft-documents',
    meta: {
      auth: true,
      group: 'documents'
    }
  },
  {
    path: '/follow-documents',
    component: () => import('@/pages/follow-document-page'),
    name: 'follow-documents',
    meta: {
      auth: true,
      group: 'documents'
    }
  },
  {
    path: '/important-documents',
    component: () => import('@/pages/document-page'),
    props: () => ({ status: 'NEW' }),
    name: 'important-documents',
    meta: {
      auth: true,
      group: 'documents'
    }
  },
  {
    path: '/all-documents',
    component: () => import('@/pages/all-document-page'),
    name: 'all-documents',
    meta: {
      auth: true
    }
  },
  {
    path: '/done-documents',
    component: () => import('@/pages/document-page'),
    props: () => ({ status: 'DONE', title: 'Văn bản đã hoàn thành', api: '/esign-api/api/document/get' }),
    name: 'done-documents',
    meta: {
      auth: true
    }
  },
  {
    path: '/cancel-documents',
    component: () => import('@/pages/document-page'),
    props: () => ({ status: 'CANCELLED', title: 'Văn bản đã huỷ', api: '/esign-api/api/document/get_by_user' }),
    name: 'cancel-documents',
    meta: {
      auth: true
    }
  },
  {
    path: '/documents/tag/:tag',
    component: () => import('@/pages/document-page'),
    props: route => ({ tag: route.params.tag, api: '/esign-api/api/document/get_by_tag' }),
    name: 'document-tagging',
    meta: {
      auth: true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/login-page'),
    meta: {
      guest: true,
      layout: 'empty'
    }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/pages/register-page'),
    meta: {
      guest: true,
      layout: 'empty'
    }
  },
  {
    path: '/forgot',
    name: 'forgot',
    component: () => import('@/pages/forgot-page'),
    meta: {
      guest: true,
      layout: 'empty'
    }
  },
  {
    path: '/external-sign',
    name: 'external-sign',
    component: () => import('@/pages/external-sign-page'),
    meta: {
      guest: true,
      layout: 'empty'
    }
  },
  {
    path: '/external-view/:uuid_url',
    name: 'external-view',
    component: () => import('@/pages/external-view-page'),
    props: route => ({ uuid_url: route.params.uuid_url }),
    meta: {
      guest: true,
      layout: 'empty'
    }
  },
  {
    path: '/external-review/:documentId/:uuid_url',
    name: 'external-review',
    component: () => import('@/pages/external-review-page'),
    props: route => ({ uuid_url: route.params.uuid_url, documentId: route.params.documentId }),
    meta: {
      guest: true,
      layout: 'empty'
    }
  },
  {
    path: '/document-upload/:uuid_url',
    name: 'document-upload',
    component: () => import('@/pages/document-upload-page'),
    props: route => ({ uuid_url: route.params.uuid_url }),
    meta: {
      auth: true
    }
  },
  {
    path: '/',
    name: 'redirect-default-page',
    redirect: { name: 'incoming-documents', params: { tab: 'wait-for-sign' } }
  }
]
