<template>
  <div class="forum-container">
    <IEBar
      v-model:address="ieAddress"
      :can-go-back="false"
      :can-go-forward="false"
      @go="onIeGo"
      @home="goToForum"
      @refresh="startLoadingSequence"
      @menu-click="onIeMenuClick"
    />
    <div class="forum-page">
      <div class="loading-strip" :class="{ hidden: isReady }">
        <div class="loading-strip__row">
          <span class="loading-strip__label">Cargando x7r9p2portfolio.onion...</span>
          <span class="loading-strip__status">{{ loadingStatus }}</span>
        </div>
        <div class="loading-strip__bar">
          <span class="loading-strip__fill" :style="{ width: `${progress}%` }"></span>
        </div>
      </div>
      <div class="forum-topline reveal-block" :class="{ visible: loadStage >= 1 }">
        <div class="forum-brand">
          <img :src="logoUrl" alt="Forum" class="forum-brand-icon" />
          <div>
            <strong>Foro de Proyectos</strong>
            <p>Proyecto personal. Documentación tardía de aplicaciones, bots y otros experimentos digitales.</p>
          </div>
        </div>

        <div class="forum-account">
          <span class="account-pill">You (online)</span>
          <span class="account-note">Ignora los mensajes extraños.</span>
        </div>
      </div>

      <div class="forum-breadcrumb reveal-block" :class="{ visible: loadStage >= 2 }">
        <a href="#">Índice</a>
        <span>&raquo;</span>
        <a href="#">Archivo del Portfolio</a>
        <span>&raquo;</span>
        <span>Página principal</span>
      </div>

      <div class="forum-nav">
        <button class="nav-item" :class="{ active: forumView === 'index' }" @click="goToForum">Foro de Proyectos</button>
        <button class="nav-item" :class="{ active: forumView === 'search' }" @click="goToSearch">Buscar</button>
        <button class="nav-item" :class="{ active: forumView === 'profile' }" @click="goToProfile">Mi Perfil</button>
        <button class="nav-item" :class="{ active: forumView === 'admin' }" @click="goToAdmin">Admin</button>
      </div>

      <div class="forum-alert reveal-block" :class="{ visible: loadStage >= 2 }">
        <strong>Aviso.</strong>
        Este archivo contiene proyectos y demos. Cada entrada incluye descripción, capturas y enlaces de descarga o acceso.
      </div>

      <div class="forum-index">
        <aside class="forum-sidebar reveal-block" :class="{ visible: loadStage >= 3 }">
          <div class="sidebar-section">
            <div class="sidebar-title">ARCHIVO</div>
            <div class="sidebar-links">
              <a href="#" @click.prevent="goToForum">&raquo; Página principal</a>
              <a href="#" @click.prevent="goToSearch">&raquo; Buscar</a>
              <a href="#" @click.prevent="goToProfile">&raquo; Mi perfil</a>
            </div>
          </div>

          <div class="sidebar-section">
            <div class="sidebar-title">CATEGORÍAS</div>
            <div class="sidebar-links">
              <a
                v-for="category in boardSections"
                :key="category.id"
                href="#"
                :class="{ 'sidebar-link--active': activeCategoryId === category.id }"
                @click.prevent="filterByCategory(category.id)"
              >
                &raquo; {{ category.name }} ({{ category.threadCount }})
              </a>
            </div>
          </div>

          <div class="sidebar-section sidebar-section--notice">
            <div class="sidebar-title">ESTADO</div>
            <p>h3ll0 fr1end</p>
            <p>Última sincronización: {{ currentTime }}</p>
          </div>

          <div class="sidebar-section">
            <div class="sidebar-title">CONECTADOS</div>
            <div class="online-list">
              <div class="online-item">
                <span class="online-dot"></span>
                <span>Gasut</span>
              </div>
              <div class="online-item">
                <span class="online-dot guest"></span>
                <span>Visitante</span>
              </div>
            </div>
          </div>
        </aside>

        <main class="forum-main reveal-block" :class="{ visible: loadStage >= 4 }">
          <div class="forum-header">
            <img :src="logoUrl" alt="Forum" class="forum-logo" />
            <div>
              <div class="forum-title">x7r9p2portfolio.onion</div>
              <div class="forum-subtitle">Proyectos varios documentados — 2001-2025</div>
            </div>
          </div>

          <div v-if="forumView === 'index'" class="forum-boards">
            <article v-for="board in boardSections" :key="board.id" class="board-card">
              <div class="board-card__title">{{ board.name }}</div>
              <div class="board-card__meta">{{ board.description }}</div>
              <div class="board-card__stats">
                <span>{{ board.threadCount }} temas</span>
                <span>{{ board.latestTitle }}</span>
              </div>
            </article>
          </div>

          <section v-if="forumView === 'thread' && activeThread" class="thread-page-shell">
            <div class="thread-page-topbar">
              <div class="thread-page-crumbs">
                <button class="crumb-link" type="button" @click="backToIndex">Índice</button>
                <span>&raquo;</span>
                <span>{{ activeThread.categoryName }}</span>
                <span>&raquo;</span>
                <span>{{ activeThread.title }}</span>
              </div>
              <button class="back-link" type="button" @click="backToIndex">Volver al foro</button>
            </div>

            <article class="thread-page-card">
              <header class="thread-page-header">
                <div class="thread-page-badge">{{ activeThread.flag }}</div>
                <div class="thread-page-titleblock">
                  <h3>{{ activeThread.title }}</h3>
                  <p>
                    {{ activeProject?.fullDescription || activeProject?.description || 'Este hilo no tiene una ficha asociada todavía.' }}
                  </p>
                </div>

                <aside class="thread-page-sidebar thread-page-sidebar--inline thread-page-sidebar--header">
                  <div class="thread-page-preview-title">Autor / estado</div>
                  <div class="thread-page-meta thread-page-meta--compact">
                    <span>Autor: {{ activeThread.author }}</span>
                    <span>Resp.: {{ activeThread.replies }}</span>
                    <span>Vis.: {{ activeThread.views }}</span>
                    <span class="last-message-meta">
                      <span>{{ getThreadLastMessageDate(activeThread) }}</span>
                      <span
                        v-if="isThreadSyncedWithGithub(activeThread)"
                        class="last-message-badge"
                        title="Sincronizado con el último commit real en GitHub"
                      >
                        GitHub
                      </span>
                      <span
                        v-else-if="isThreadPrivateLike(activeThread)"
                        class="last-message-badge last-message-badge--private"
                        title="Repositorio privado o inaccesible desde el cliente"
                      >
                        Pr1v4d0
                      </span>
                    </span>
                  </div>
                  <div class="thread-page-signature thread-page-signature--header">
                    <span class="signature-label">firma</span>
                    <div class="signature-banner">~ {{ activeThread.author }} ~</div>
                  </div>
                </aside>
              </header>

              <div class="thread-page-body">
                <section class="thread-post">
                  <div class="post-head">
                    <strong>{{ activeThread.title }}</strong>
                    <span class="post-head-meta">
                      Publicado por {{ activeThread.author }} ·
                      <span class="last-message-meta">
                        <span>{{ getThreadLastMessageDate(activeThread) }}</span>
                        <span
                          v-if="isThreadSyncedWithGithub(activeThread)"
                          class="last-message-badge"
                          title="Sincronizado con el último commit real en GitHub"
                        >
                          GitHub
                        </span>
                        <span
                          v-else-if="isThreadPrivateLike(activeThread)"
                          class="last-message-badge last-message-badge--private"
                          title="Repositorio privado o inaccesible desde el cliente"
                        >
                          Pr1v4d0
                        </span>
                      </span>
                    </span>
                  </div>

                  <div class="post-intro-row">
                    <div class="post-intro-copy">
                      <p class="post-copy">
                        {{ activeProject?.description || 'Sin descripción disponible.' }}
                      </p>
                      <div v-if="activeProject" class="thread-page-links post-inline-links">
                        <a
                          v-if="activeProject.github"
                          :href="activeProject.github"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="detail-link"
                        >
                          Repositorio
                        </a>
                        <a
                          v-if="activeProject.demo"
                          :href="activeProject.demo"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="detail-link"
                        >
                          Live
                        </a>
                        <a
                          v-if="activeProject.release"
                          :href="activeProject.release"
                          target="_blank"
                          rel="noopener noreferrer"
                          class="detail-link"
                        >
                          Descarga
                        </a>
                      </div>
                    </div>
                  </div>

                  <div class="thread-page-body-content">
                    <div v-if="activeProject?.screenshots?.length" class="thread-page-gallery">
                      <button
                        v-for="(screenshot, index) in activeProject.screenshots"
                        :key="`${activeProject.id}-shot-${index}`"
                        class="forum-shot"
                        :class="{ active: activeGalleryIndex === index }"
                        type="button"
                        @click="setActiveScreenshot(index)"
                      >
                        <img :src="screenshot" :alt="`${activeProject.name} captura ${index + 1}`" />
                      </button>
                    </div>

                    <div v-if="activeProject?.tech?.length" class="thread-page-tech thread-page-tech--inline">
                      <span
                        v-for="tech in activeProject.tech"
                        :key="tech"
                        class="thread-tech-chip"
                      >
                        {{ tech }}
                      </span>
                    </div>
                  </div>
                </section>
              </div>
            </article>
          </section>

          <table v-if="forumView === 'index'" class="thread-list" cellpadding="3" cellspacing="0">
            <thead>
              <tr class="header-row">
                <td class="col-topic">Tema</td>
                <td class="col-author">Autor</td>
                <td class="col-replies">Resp.</td>
                <td class="col-views">Vis.</td>
                <td class="col-last">Último mensaje</td>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(thread, index) in filteredThreads"
                :key="thread.id"
                class="thread-row"
                :class="{ alt: index % 2 === 1, sticky: thread.isSticky, visible: loadStage >= 4 }"
                :style="{ '--row-index': index }"
              >
                <td class="col-topic">
                  <div class="thread-head">
                    <span class="thread-flag">{{ thread.flag }}</span>
                    <a
                      href="#"
                      class="thread-link"
                      :class="{ active: activeThread?.id === thread.id }"
                      @click.prevent="selectThread(thread.id)"
                    >
                      {{ thread.title }}
                    </a>
                  </div>
                  <div class="thread-category">{{ thread.categoryName }}</div>
                </td>
                <td class="col-author">{{ thread.author }}</td>
                <td class="col-replies">{{ thread.replies }}</td>
                <td class="col-views">{{ thread.views }}</td>
                <td class="col-last">
                  <div class="last-message-meta">
                    <span>{{ getThreadLastMessageDate(thread) }}</span>
                    <span
                      v-if="isThreadSyncedWithGithub(thread)"
                      class="last-message-badge"
                      title="Sincronizado con el último commit real en GitHub"
                    >
                      GitHub
                    </span>
                    <span
                      v-else-if="isThreadPrivateLike(thread)"
                      class="last-message-badge last-message-badge--private"
                      title="Repositorio privado o inaccesible desde el cliente"
                    >
                      Pr1v4d0
                    </span>
                    <span
                      v-else-if="isThreadCorruptedLike(thread)"
                      class="last-message-badge last-message-badge--corrupt"
                      title="Marca estética del foro"
                    >
                      C0rrupt0
                    </span>
                  </div>
                  <div class="last-author">por {{ thread.author }}</div>
                </td>
              </tr>
              <tr v-if="filteredThreads.length === 0 && allThreads.length > 0">
                <td colspan="5" class="no-threads">
                  <div class="empty-state">
                    <div class="empty-state-icon">📂</div>
                    <div class="empty-state-title">Sin entradas en esta categoría</div>
                    <div class="empty-state-text">No se encontraron proyectos en esta categoría del archivo.<br>Prueba seleccionando otra categoría o vuelve a la página principal.</div>
                  </div>
                </td>
              </tr>
              <tr v-else-if="allThreads.length === 0">
                <td colspan="5" class="no-threads">
                  <div class="empty-state">
                    <div class="empty-state-icon">📂</div>
                    <div class="empty-state-title">Archivo vacío</div>
                    <div class="empty-state-text">Aún no se ha subido nada a esta sección del archivo.<br>Los proyectos aparecerán aquí conforme se publiquen.</div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <section v-if="forumView === 'search'" class="search-view">
            <div class="search-header">
              <div class="search-title">Buscar en el archivo</div>
              <div class="search-input-wrap">
                <input
                  v-model="searchQuery"
                  class="search-input"
                  type="text"
                  placeholder="Escribe para buscar..."
                  @keydown.enter.prevent="openFirstSearchResult"
                  autofocus
                />

                <select v-model="searchCategory" class="search-select" aria-label="Filtrar por categoría">
                  <option value="all">Todas las categorías</option>
                  <option v-for="category in categories" :key="`search-${category.id}`" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>

                <button
                  v-if="hasSearchCriteria"
                  class="search-clear-btn"
                  type="button"
                  @click="clearSearch"
                >
                  Limpiar
                </button>
              </div>
            </div>
            <div v-if="hasSearchCriteria" class="search-results">
              <div class="search-results-count">
                {{ searchResults.length }} resultado(s)
                <template v-if="searchQuery.trim()"> para "{{ searchQuery }}"</template>
              </div>
              <div v-if="searchResults.length === 0" class="no-threads">
                No se encontraron temas con ese término.
              </div>
              <table v-else class="thread-list" cellpadding="3" cellspacing="0">
                <thead>
                  <tr class="header-row">
                    <td class="col-topic">Tema</td>
                    <td class="col-author">Autor</td>
                    <td class="col-replies">Resp.</td>
                    <td class="col-views">Vis.</td>
                    <td class="col-last">Último mensaje</td>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(thread, index) in searchResults"
                    :key="thread.id"
                    class="thread-row"
                    :class="{ alt: index % 2 === 1, visible: true }"
                    :style="{ '--row-index': index }"
                  >
                    <td class="col-topic">
                      <div class="thread-head">
                        <span class="thread-flag">{{ thread.flag }}</span>
                        <a href="#" class="thread-link" @click.prevent="selectThread(thread.id)">
                          {{ thread.title }}
                        </a>
                      </div>
                      <div class="thread-category">{{ thread.categoryName }}</div>
                    </td>
                    <td class="col-author">{{ thread.author }}</td>
                    <td class="col-replies">{{ thread.replies }}</td>
                    <td class="col-views">{{ thread.views }}</td>
                    <td class="col-last">
                      <div class="last-message-meta">
                        <span>{{ getThreadLastMessageDate(thread) }}</span>
                        <span
                          v-if="isThreadSyncedWithGithub(thread)"
                          class="last-message-badge"
                          title="Sincronizado con el último commit real en GitHub"
                        >
                          GitHub
                        </span>
                        <span
                          v-else-if="isThreadPrivateLike(thread)"
                          class="last-message-badge last-message-badge--private"
                          title="Repositorio privado o inaccesible desde el cliente"
                        >
                          Pr1v4d0
                        </span>
                        <span
                          v-else-if="isThreadCorruptedLike(thread)"
                          class="last-message-badge last-message-badge--corrupt"
                          title="Marca estética del foro"
                        >
                          C0rrupt0
                        </span>
                      </div>
                      <div class="last-author">por {{ thread.author }}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="search-empty">
              Escribe un término arriba para buscar en las entradas del archivo.
            </div>
          </section>

          <section v-if="forumView === 'profile'" class="profile-view">
            <div class="profile-header">
              <div class="profile-avatar-lg">L</div>
              <div class="profile-header-info">
                <div class="profile-fullname">Leonardo Vargas Martínez</div>
                <div class="profile-subtitle">Desarrollador Full Stack · Egresado de Tecsup</div>
                <div class="profile-location">
                  <span>📍 Arequipa, Perú</span>
                </div>
              </div>
            </div>

            <div class="profile-contact-bar">
              <a href="mailto:martinvar.76@gmail.com" class="contact-item">📧 martinvar.76@gmail.com</a>
              <span class="contact-sep">|</span>
              <span class="contact-item">📱 919530281 - 951766671</span>
              <span class="contact-sep">|</span>
              <a href="https://linkedin.com/in/leonardo-vargas-81a118387/" target="_blank" class="contact-item">🔗 LinkedIn</a>
              <span class="contact-sep">|</span>
              <a href="https://github.com/GatuzoCXL" target="_blank" class="contact-item">💻 GitHub</a>
            </div>

            <div class="profile-section-block">
              <div class="profile-section-header">
                <span class="section-icon">👤</span>
                <span class="section-title">Perfil Profesional</span>
              </div>
              <div class="profile-section-body">
                Desarrollador Full Stack egresado de Tecsup, especializado en aplicaciones web y móviles multiplataforma. Combino la creación de software con una sólida base técnica en soporte TI, redes y administración de servidores (Linux/Windows), ofreciendo soluciones integrales desde la escritura del código hasta la gestión de la infraestructura.
              </div>
            </div>

            <div class="profile-section-block">
              <div class="profile-section-header">
                <span class="section-icon">⚙️</span>
                <span class="section-title">Habilidades Técnicas</span>
              </div>
              <div class="profile-section-body">
                <div class="skill-group">
                  <div class="skill-category">
                    <span class="skill-cat-label">Backend & Lógica</span>
                    <div class="skill-chips">
                      <span class="thread-tech-chip">Node.js</span>
                      <span class="thread-tech-chip">Express</span>
                      <span class="thread-tech-chip">C# .NET</span>
                      <span class="thread-tech-chip">Socket.IO</span>
                      <span class="thread-tech-chip">REST APIs</span>
                    </div>
                  </div>
                  <div class="skill-category">
                    <span class="skill-cat-label">Bases de Datos</span>
                    <div class="skill-chips">
                      <span class="thread-tech-chip">SQL</span>
                      <span class="thread-tech-chip">Firebase</span>
                      <span class="thread-tech-chip">Redis</span>
                      <span class="thread-tech-chip">Diseño de Esquemas</span>
                    </div>
                  </div>
                  <div class="skill-category">
                    <span class="skill-cat-label">Frontend & Mobile</span>
                    <div class="skill-chips">
                      <span class="thread-tech-chip">React.js</span>
                      <span class="thread-tech-chip">Flutter</span>
                      <span class="thread-tech-chip">Vite</span>
                      <span class="thread-tech-chip">Tailwind CSS</span>
                      <span class="thread-tech-chip">UX/UI</span>
                    </div>
                  </div>
                  <div class="skill-category">
                    <span class="skill-cat-label">DevOps & Cloud</span>
                    <div class="skill-chips">
                      <span class="thread-tech-chip">Git/GitHub</span>
                      <span class="thread-tech-chip">Docker</span>
                      <span class="thread-tech-chip">AWS EC2/S3</span>
                      <span class="thread-tech-chip">Nginx</span>
                      <span class="thread-tech-chip">Scrum</span>
                    </div>
                  </div>
                  <div class="skill-category">
                    <span class="skill-cat-label">Infraestructura TI</span>
                    <div class="skill-chips">
                      <span class="thread-tech-chip">Linux</span>
                      <span class="thread-tech-chip">Windows Server</span>
                      <span class="thread-tech-chip">Active Directory</span>
                      <span class="thread-tech-chip">Redes LAN/Mesh</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="profile-section-block">
              <div class="profile-section-header">
                <span class="section-icon">🚀</span>
                <span class="section-title">Experiencia y Proyectos Destacados</span>
              </div>
              <div class="profile-section-body">
                <div class="experience-item">
                  <div class="exp-header">
                    <span class="exp-title">Desarrollo Web para Infraestructura (Freelance)</span>
                    <span class="exp-date">2024</span>
                  </div>
                  <div class="exp-desc">
                    Diseño y desarrollo de la arquitectura Full Stack de un sitio web corporativo responsivo. Implementación de lógica de negocio en backend y optimización del rendimiento, carga y SEO. Configuración del entorno de producción y despliegue continuo del frontend.
                  </div>
                </div>
                <div class="experience-divider"></div>
                <div class="experience-item">
                  <div class="exp-header">
                    <span class="exp-title">Joya Express - App de Transporte (Startup Académica)</span>
                    <span class="exp-date">2025</span>
                  </div>
                  <div class="exp-desc">
                    Desarrollo del aplicativo móvil multiplataforma (pasajeros/conductores) usando <span class="tech-tag">Flutter</span>. Programación del backend con <span class="tech-tag">Node.js</span> y gestión de estado en tiempo real con <span class="tech-tag">Redis</span>. Despliegue de microservicios en <span class="tech-tag">AWS EC2</span> utilizando contenedores <span class="tech-tag">Docker</span> para alta disponibilidad.
                  </div>
                </div>
                <div class="experience-divider"></div>
                <div class="experience-item">
                  <div class="exp-header">
                    <span class="exp-title">Rosy Music Bot (Open Source)</span>
                    <span class="exp-date">2024</span>
                  </div>
                  <div class="exp-desc">
                    Automatización y gestión de flujos de audio estables utilizando <span class="tech-tag">Node.js</span> y <span class="tech-tag">Discord.js</span>. Implementación de lógica asíncrona avanzada para el manejo de múltiples peticiones simultáneas.
                  </div>
                </div>
                <div class="experience-divider"></div>
                <div class="experience-item">
                  <div class="exp-header">
                    <span class="exp-title">Sistema IoT de Monitoreo de Alimentos (Tecsup)</span>
                    <span class="exp-date">2024</span>
                  </div>
                  <div class="exp-desc">
                    Integración de hardware y software para la telemetría de sensores en tiempo real. <strong>Seleccionado entre los 10 mejores proyectos</strong> de innovación por su precisión técnica y arquitectura.
                  </div>
                </div>
              </div>
            </div>

            <div class="profile-section-block">
              <div class="profile-section-header">
                <span class="section-icon">🎓</span>
                <span class="section-title">Educación y Certificaciones</span>
              </div>
              <div class="profile-section-body">
                <div class="edu-item">
                  <span class="edu-degree">Diseño y Desarrollo de Software</span>
                  <span class="edu-meta">Tecsup, Arequipa · 2023 -- 2025</span>
                </div>
                <div class="edu-item">
                  <span class="edu-degree">Educación Secundaria</span>
                  <span class="edu-meta">I.E. Mario Vargas Llosa, Paucarpata · 2015 -- 2019</span>
                </div>
                <div class="cert-items">
                  <div class="cert-item">
                    <span class="cert-icon">📋</span>
                    <span>Scrum Foundation Professional (SFPC) -- CertiProf (2024)</span>
                  </div>
                  <div class="cert-item">
                    <span class="cert-icon">📋</span>
                    <span>Lean Six Sigma White Belt -- CertiProf (2024)</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="profile-section-block">
              <div class="profile-section-header">
                <span class="section-icon">🌍</span>
                <span class="section-title">Idiomas</span>
              </div>
              <div class="profile-section-body">
                <div class="languages-row">
                  <span class="lang-badge">Español (Nativo)</span>
                  <span class="lang-badge">Inglés (B1)</span>
                  <span class="lang-badge">Ruso (A1)</span>
                </div>
              </div>
            </div>
          </section>

          <section v-if="forumView === 'admin'" class="admin-view">
            <div class="admin-locked">
              <div class="admin-lock-icon">🔒</div>
              <div class="admin-lock-content">
                <div class="admin-lock-title">Acceso denegado</div>
                <div class="admin-lock-msg">
                  Necesitas registrarte como administrador para acceder a esta sección.
                  <br />Si crees que esto es un error, contacta al administrador del sistema.
                </div>
              </div>
            </div>
            <div class="admin-form-placeholder">
              <div class="admin-form-header">Formulario de acceso administrativo</div>
              <div class="admin-form-body">
                <div class="form-field">
                  <label>Usuario</label>
                  <input type="text" class="form-input" placeholder="Ingresa tu usuario" disabled />
                </div>
                <div class="form-field">
                  <label>Contraseña</label>
                  <input type="password" class="form-input" placeholder="Ingresa tu contraseña" disabled />
                </div>
                <button class="admin-submit-btn" disabled>Acceder</button>
              </div>
              <div class="admin-form-note">
                Este panel se activará una vez que el administrador habilite tu cuenta.
              </div>
            </div>
          </section>

          <div v-if="forumView === 'index'" class="forum-pagination">
            <button class="page-btn" disabled>&lt;&lt;</button>
            <button class="page-btn" disabled>&lt;</button>
            <span class="page-current">1</span>
            <button class="page-btn" disabled title="Próximamente">2</button>
            <button class="page-btn" disabled title="Próximamente">3</button>
            <button class="page-btn" disabled>&gt;</button>
            <button class="page-btn" disabled>&gt;&gt;</button>
          </div>

          <div v-if="forumView === 'index'" class="forum-stats-bar">
            <span>Hay {{ threads.length }} temas.</span>
            <span class="sep">|</span>
            <span>Miembros: 1</span>
            <span class="sep">|</span>
            <span>Mensajes: {{ threads.length }}</span>
            <span class="sep">|</span>
            <span>Último: Gasut</span>
          </div>

          <div v-if="forumView === 'index'" class="forum-footer">
            <span class="footer-info">Hay {{ forumStats.totalThreads }} temas.</span>
            <span class="footer-separator">|</span>
            <span class="footer-info">{{ forumStats.totalReplies }} respuestas</span>
            <span class="footer-separator">|</span>
            <span class="footer-info">{{ forumStats.totalViews }} visitas</span>
          </div>

          <div v-if="forumView === 'index'" class="forum-detail-panel forum-detail-panel--hint">
            <strong>Nota:</strong> selecciona una entrada para ver la descripción, capturas y enlaces asociados.
          </div>

          <div class="forum-status-bar">
            <span>Listo</span>
            <span class="sep">|</span>
            <span>{{ currentTime }}</span>
            <span class="sep">|</span>
            <span>{{ usersOnline.length }} usuario(s) en línea</span>
          </div>
        </main>
      </div>
    </div>

    <Teleport v-if="currentScreenshot" to="body">
      <div class="image-viewer" @click="closeImageViewer">
        <div class="image-viewer-content" @click.stop>
          <button class="nav-button close-button" @click="closeImageViewer" aria-label="Cerrar">
            <span></span>
          </button>

          <button class="nav-button prev-button" @click="showPreviousImage" aria-label="Anterior">
            <span></span>
          </button>

          <img :src="currentScreenshot" :alt="activeProject?.name || 'Captura del foro'" />

          <button class="nav-button next-button" @click="showNextImage" aria-label="Siguiente">
            <span></span>
          </button>

          <p class="image-counter">
            Imagen {{ selectedImageIndex + 1 }} de {{ activeProject?.screenshots?.length || 0 }} ·
            Flechas / A-D
          </p>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { usePortfolioContent } from '@/composables/usePortfolioContent'
import { assetUrl } from '@/utils/assetUrl'
import IEBar from '@/components/os/IEBar.vue'

const { projects, loadContent } = usePortfolioContent()

const categories = [
  {
    id: 'web',
    name: 'Desarrollo Web',
    description: 'Sitios, interfaces y experimentos visuales.',
  },
  {
    id: 'personal',
    name: 'Proyectos Personales',
    description: 'Ideas raras, utilidades y demos hechas por gusto.',
  },
  {
    id: 'bots',
    name: 'Bots & Automatización',
    description: 'Bots, scripts y rutinas automáticas.',
  },
  {
    id: 'uiux',
    name: 'UI/UX',
    description: 'Detalles visuales, flujo y presentación.',
  },
]

const techToCategory = {
  React: 'web',
  'React Native': 'web',
  Vue: 'web',
  Angular: 'web',
  'Node.js': 'web',
  HTML5: 'web',
  CSS3: 'web',
  JavaScript: 'web',
  'Discord.js': 'bots',
  Electron: 'personal',
  'Canvas API': 'personal',
  MongoDB: 'personal',
  Firebase: 'web',
  'Google Maps API': 'web',
  'YouTube API': 'bots',
}

const logoUrl = assetUrl('icons/internet-explorer.svg')

const hashString = (value) => {
  let hash = 0
  for (const char of value) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0
  }
  return hash
}

const numberFromSeed = (seed, min, max) => {
  const range = max - min + 1
  return min + (hashString(seed) % range)
}

const getCategoryForProject = (project) => {
  if (!project.tech?.length) {
    return categories.find(category => category.id === 'personal')
  }

  for (const tech of project.tech) {
    const categoryId = techToCategory[tech]
    if (categoryId) {
      return categories.find(category => category.id === categoryId)
    }
  }

  return categories.find(category => category.id === 'personal')
}

const threads = computed(() => {
  return projects.value.map((project, index) => {
    const category = getCategoryForProject(project)
    const baseSeed = `${project.id}:${project.name}:${index}`

    return {
      id: project.id,
      title: project.name,
      author: 'Gasut',
      projectId: project.id,
      date: `24/04/2025 ${String(3 + (hashString(baseSeed) % 9)).padStart(2, '0')}:${String(hashString(`${baseSeed}:minute`) % 60).padStart(2, '0')} AM`,
      replies: numberFromSeed(baseSeed, 0, 18),
      views: numberFromSeed(`${baseSeed}:views`, 84, 640),
      categoryId: category.id,
      categoryName: category.name,
      flag: index === 0 ? 'nuevo' : 'proyecto',
      isSticky: false,
    }
  })
})

const allThreads = computed(() => threads.value)

const latestCommitByProjectId = ref({})

const glitchSignatures = [
  ':://??__n0-s1gn4l__??//::',
  '[0xPR1V8]::{d3-sync}//??',
  '<<::n0-t1m3-st4mp::>>',
  '##/cryptic-feed/??/null##',
  '~~[t3mp0r4l-r3d4ct3d]~~',
  '::gh0st-cl0ck::--:--::',
]

const parseGithubRepo = (url) => {
  if (!url) {
    return null
  }

  const match = String(url).trim().match(/^https?:\/\/github\.com\/([^/]+)\/([^/#?]+?)(?:\.git)?(?:[/?#].*)?$/i)
  if (!match) {
    return null
  }

  return {
    owner: match[1],
    repo: match[2],
  }
}

const formatForumDateTime = (value) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return ''
  }

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  const hours24 = date.getHours()
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const meridiem = hours24 >= 12 ? 'PM' : 'AM'
  const hours12 = hours24 % 12 || 12

  return `${day}/${month}/${year} ${String(hours12).padStart(2, '0')}:${minutes} ${meridiem}`
}

const fetchLatestCommitDate = async (owner, repo) => {
  const endpoint = `https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`
  const response = await fetch(endpoint, {
    headers: {
      Accept: 'application/vnd.github+json',
    },
  })

  if (!response.ok) {
    throw new Error(`github ${response.status}`)
  }

  const commits = await response.json()
  return commits?.[0]?.commit?.committer?.date || null
}

const loadLatestCommitDates = async (projectItems) => {
  const entries = await Promise.all(
    (projectItems || []).map(async (project) => {
      const repoData = parseGithubRepo(project.github)
      if (!repoData) {
        return [project.id, null]
      }

      try {
        const commitDate = await fetchLatestCommitDate(repoData.owner, repoData.repo)
        return [project.id, commitDate]
      } catch {
        return [project.id, null]
      }
    }),
  )

  latestCommitByProjectId.value = Object.fromEntries(entries)
}

const getThreadLastMessageDate = (thread) => {
  if (!thread?.projectId) {
    return thread?.date || ''
  }

  const commitDate = latestCommitByProjectId.value[thread.projectId]
  if (!commitDate) {
    if (isThreadPrivateLike(thread)) {
      return getThreadDistortedDate(thread)
    }

    return thread.date
  }

  return formatForumDateTime(commitDate) || thread.date
}

const getThreadDistortedDate = (thread) => {
  const seed = hashString(`${thread.id}:${thread.title}`)
  const signature = glitchSignatures[seed % glitchSignatures.length]
  const shard = ((seed ^ 0xa5a5a5a5) >>> 0).toString(16).slice(0, 6)

  return `${signature} [${shard}]`
}

const isThreadSyncedWithGithub = (thread) => {
  if (!thread?.projectId) {
    return false
  }

  return Boolean(latestCommitByProjectId.value[thread.projectId])
}

const isThreadPrivateLike = (thread) => {
  if (!thread?.projectId) {
    return false
  }

  const relatedProject = projects.value.find(project => project.id === thread.projectId)
  if (!relatedProject) {
    return false
  }

  // Sin repo público se trata como privado por diseño.
  if (!relatedProject.github) {
    return true
  }

  // Repo existe pero fallo sincronizacion: mantener modo privado.
  return !latestCommitByProjectId.value[thread.projectId]
}

const isThreadCorruptedLike = (thread) => {
  if (!thread?.projectId) {
    return false
  }

  return Boolean(thread.projectId && !isThreadSyncedWithGithub(thread) && !isThreadPrivateLike(thread))
}

const forumView = ref('index')
const selectedThreadId = ref(null)
const selectedImageIndex = ref(null)
const activeGalleryIndex = ref(0)
const activeCategoryId = ref(null)
const searchQuery = ref('')
const searchCategory = ref('all')
const hasSearchCriteria = computed(() => searchQuery.value.trim().length > 0 || searchCategory.value !== 'all')

const filteredThreads = computed(() => {
  if (activeCategoryId.value === null) {
    return allThreads.value
  }
  return allThreads.value.filter(thread => thread.categoryId === activeCategoryId.value)
})

const filterByCategory = (categoryId) => {
  if (activeCategoryId.value === categoryId) {
    activeCategoryId.value = null
  } else {
    activeCategoryId.value = categoryId
  }
  forumView.value = 'index'
  selectedThreadId.value = null
}

const normalizeSearch = (value) => {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

const searchResults = computed(() => {
  const term = normalizeSearch(searchQuery.value.trim())

  // Busqueda filtra por hilos de proyectos, no por anuncios fijados.
  const filteredByCategory = threads.value.filter((thread) => {
    return searchCategory.value === 'all' || thread.categoryId === searchCategory.value
  })

  if (!term) {
    return filteredByCategory
  }

  return filteredByCategory.filter((thread) => {
    const relatedProject = projects.value.find(project => project.id === thread.projectId)
    const searchable = [
      thread.title,
      thread.categoryName,
      thread.author,
      relatedProject?.description,
      relatedProject?.fullDescription,
      (relatedProject?.tech || []).join(' '),
    ]

    return searchable.some(field => normalizeSearch(field).includes(term))
  })
})

const goToForum = () => {
  activeCategoryId.value = null
  forumView.value = 'index'
}

const goToSearch = () => {
  forumView.value = 'search'
}

const clearSearch = () => {
  searchQuery.value = ''
  searchCategory.value = 'all'
}

const openFirstSearchResult = () => {
  if (!searchResults.value.length) {
    return
  }

  selectThread(searchResults.value[0].id)
}

const goToProfile = () => {
  forumView.value = 'profile'
}

const goToAdmin = () => {
  forumView.value = 'admin'
}

const selectedThread = computed(() => {
  if (!selectedThreadId.value) {
    return null
  }

  return allThreads.value.find(thread => thread.id === selectedThreadId.value) || null
})

const activeThread = computed(() => selectedThread.value)

const activeProject = computed(() => {
  if (!activeThread.value?.projectId) {
    return null
  }

  return projects.value.find(project => project.id === activeThread.value.projectId) || null
})

const activeScreenshot = computed(() => {
  if (!activeProject.value?.screenshots?.length) {
    return null
  }

  return activeProject.value.screenshots[activeGalleryIndex.value] || activeProject.value.screenshots[0] || null
})

const currentScreenshot = computed(() => {
  if (!activeProject.value?.screenshots?.length || selectedImageIndex.value === null) {
    return null
  }

  return activeProject.value.screenshots[selectedImageIndex.value] || null
})

const selectThread = (threadId) => {
  selectedThreadId.value = threadId
  forumView.value = 'thread'
  selectedImageIndex.value = null
  activeGalleryIndex.value = 0
}

const backToIndex = () => {
  activeCategoryId.value = null
  forumView.value = 'index'
}

const setActiveScreenshot = (index) => {
  activeGalleryIndex.value = index
  selectedImageIndex.value = index
}

const openImageViewer = (index) => {
  activeGalleryIndex.value = index
  selectedImageIndex.value = index
}

const closeImageViewer = () => {
  selectedImageIndex.value = null
}

const showNextImage = () => {
  if (!activeProject.value?.screenshots?.length || selectedImageIndex.value === null) {
    return
  }

  selectedImageIndex.value = (selectedImageIndex.value + 1) % activeProject.value.screenshots.length
  activeGalleryIndex.value = selectedImageIndex.value
}

const showPreviousImage = () => {
  if (!activeProject.value?.screenshots?.length || selectedImageIndex.value === null) {
    return
  }

  selectedImageIndex.value =
    (selectedImageIndex.value - 1 + activeProject.value.screenshots.length) % activeProject.value.screenshots.length
  activeGalleryIndex.value = selectedImageIndex.value
}

const handleViewerKeyboard = (event) => {
  if (selectedImageIndex.value === null) {
    return
  }

  const key = event.key.toLowerCase()

  if (event.key === 'ArrowRight' || key === 'd') {
    event.preventDefault()
    showNextImage()
    return
  }

  if (event.key === 'ArrowLeft' || key === 'a') {
    event.preventDefault()
    showPreviousImage()
    return
  }

  if (event.key === 'Escape') {
    event.preventDefault()
    closeImageViewer()
  }
}

watch(
  allThreads,
  (items) => {
    if (!items.length) {
      return
    }

    const hasSelected = items.some(thread => thread.id === selectedThreadId.value)
    if (selectedThreadId.value && !hasSelected) {
      selectedThreadId.value = null
      activeCategoryId.value = null
      forumView.value = 'index'
    }
  },
  { immediate: true },
)

watch(activeProject, () => {
  activeGalleryIndex.value = 0
  selectedImageIndex.value = null
})

watch(
  projects,
  (items) => {
    void loadLatestCommitDates(items)
  },
  { immediate: true },
)

const boardSections = computed(() => {
  return categories.map((category) => {
    const categoryThreads = allThreads.value.filter(thread => thread.categoryId === category.id)
    const latestThread = categoryThreads[0]

    return {
      ...category,
      threadCount: categoryThreads.length,
      latestTitle: latestThread?.title ?? 'Sin actividad',
    }
  })
})

const forumStats = computed(() => ({
  totalThreads: allThreads.value.length,
  totalReplies: allThreads.value.reduce((sum, thread) => sum + thread.replies, 0),
  totalViews: allThreads.value.reduce((sum, thread) => sum + thread.views, 0),
}))

const loadStage = ref(0)
const progress = ref(0)
const loadingStatus = ref('Inicializando portal...')
const currentTime = ref('')
const usersOnline = ref(['Gasut', 'Visitante'])
const ieAddress = ref('http://x7r9p2portfolio.onion/')

const onIeGo = () => {
  const addr = ieAddress.value.toLowerCase()
  if (addr.includes('search')) {
    goToSearch()
  } else if (addr.includes('profile')) {
    goToProfile()
  } else if (addr.includes('admin')) {
    goToAdmin()
  } else {
    goToForum()
  }
}

const onIeMenuClick = () => {
  // Placeholder: no menu actions implemented
}

const isReady = computed(() => loadStage.value >= 5)

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })
}

let loadTimers = []
let timeInterval = null
let commitSyncInterval = null
const COMMIT_SYNC_INTERVAL_MS = 10 * 60_000

const clearLoadTimers = () => {
  for (const timer of loadTimers) {
    clearTimeout(timer)
  }
  loadTimers = []
}

const startLoadingSequence = () => {
  clearLoadTimers()
  loadStage.value = 0
  progress.value = 6
  loadingStatus.value = 'Marcando la cabecera...'

  const steps = [
    { stage: 1, delay: 220, progress: 18, status: 'Cargando la cabecera XP...' },
    { stage: 2, delay: 640, progress: 38, status: 'Desplegando el aviso principal...' },
    { stage: 3, delay: 980, progress: 62, status: 'Revelando la barra lateral...' },
    { stage: 4, delay: 1340, progress: 82, status: 'Montando los temas del foro...' },
    { stage: 5, delay: 1760, progress: 100, status: ':)' },
  ]

  for (const step of steps) {
    const timer = setTimeout(() => {
      loadStage.value = step.stage
      progress.value = step.progress
      loadingStatus.value = step.status
    }, step.delay)

    loadTimers.push(timer)
  }
}

onMounted(() => {
  loadContent()
  startLoadingSequence()
  updateTime()
  timeInterval = window.setInterval(updateTime, 60_000)
  commitSyncInterval = window.setInterval(() => {
    void loadLatestCommitDates(projects.value)
  }, COMMIT_SYNC_INTERVAL_MS)
  window.addEventListener('keydown', handleViewerKeyboard)
})

onUnmounted(() => {
  clearLoadTimers()
  if (timeInterval) {
    clearInterval(timeInterval)
    timeInterval = null
  }

  if (commitSyncInterval) {
    clearInterval(commitSyncInterval)
    commitSyncInterval = null
  }

  window.removeEventListener('keydown', handleViewerKeyboard)
})
</script>

<style scoped>
.forum-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  min-width: 0;
  overflow: auto;
  background:
    radial-gradient(circle at top, rgba(137, 23, 23, 0.28), transparent 44%),
    linear-gradient(180deg, #09090c 0%, #191113 48%, #0b0b0f 100%);
  font-family: Tahoma, 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
  color: #e8e1de;
  position: relative;
}

.forum-container::before {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  background:
    repeating-linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.035) 0,
      rgba(255, 255, 255, 0.015) 2px,
      transparent 4px,
      transparent 6px
    );
  mix-blend-mode: screen;
  opacity: 0.28;
}

.forum-page {
  min-height: 100%;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.loading-strip {
  border: 1px solid #4f0f19;
  background: linear-gradient(180deg, #26070d 0%, #0e0608 100%);
  box-shadow: inset 0 0 0 1px rgba(255, 176, 176, 0.12);
  padding: 6px 8px 7px;
  transition: opacity 300ms ease, visibility 0ms ease 300ms,
              max-height 300ms ease, padding 300ms ease, border-width 300ms ease;
  overflow: hidden;
}

.loading-strip.hidden {
  opacity: 0;
  visibility: hidden;
  max-height: 0;
  padding: 0;
  border-width: 0;
}

.loading-strip__row {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: center;
  margin-bottom: 6px;
  color: #f6d8d2;
}

.loading-strip__label,
.loading-strip__status {
  font-size: 10px;
  letter-spacing: 0.02em;
}

.loading-strip__status {
  color: #f1a6a0;
  text-align: right;
}

.loading-strip__bar {
  height: 10px;
  border: 1px solid #6b1a24;
  background: #130408;
  overflow: hidden;
}

.loading-strip__fill {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #6c111c 0%, #c61d33 42%, #ff7d6b 100%);
  box-shadow: 0 0 12px rgba(255, 96, 96, 0.3);
  transition: width 0.18s ease;
}

.reveal-block {
  opacity: 0;
  transform: translateY(-10px);
  filter: blur(1px);
  transition:
    opacity 0.38s ease,
    transform 0.38s ease,
    filter 0.38s ease;
}

.reveal-block.visible {
  opacity: 1;
  transform: translateY(0);
  filter: blur(0);
}

.forum-topline {
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  gap: 12px;
  padding: 12px;
  border: 1px solid #53111b;
  background: linear-gradient(180deg, rgba(41, 14, 20, 0.96) 0%, rgba(14, 10, 13, 0.95) 100%);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.06),
    0 8px 24px rgba(0, 0, 0, 0.28);
}

.forum-brand {
  display: flex;
  gap: 10px;
  align-items: center;
  min-width: 0;
}

.forum-brand-icon {
  width: 42px;
  height: 42px;
  image-rendering: pixelated;
  filter: drop-shadow(0 0 8px rgba(255, 103, 103, 0.2));
}

.forum-brand strong {
  display: block;
  font-size: 18px;
  color: #f6c9c4;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.forum-brand p {
  margin: 3px 0 0;
  max-width: 700px;
  color: #d3b1ab;
  font-size: 11px;
  line-height: 1.4;
}

.forum-account {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  max-width: 260px;
  text-align: right;
}

.account-pill {
  align-self: flex-end;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 8px;
  border: 1px solid rgba(127, 26, 40, 0.45);
  border-radius: 999px;
  background: rgba(127, 26, 40, 0.15);
  color: #ffd5d0;
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.account-note {
  color: #9a7872;
  font-size: 10px;
  line-height: 1.4;
}

.forum-breadcrumb {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
  padding: 5px 10px;
  background: linear-gradient(180deg, #e8e8d8 0%, #d4d0c0 100%);
  color: #333;
  font-size: 11px;
  border-bottom: 1px solid #a8a8a8;
}

.forum-breadcrumb a {
  color: #004894;
  text-decoration: none;
}

.forum-breadcrumb a:hover {
  text-decoration: underline;
}

.forum-nav {
  display: flex;
  background: #e8e8d0;
  border-bottom: 2px solid #a8a8a8;
  padding: 2px 4px;
  gap: 2px;
}

.nav-item {
  padding: 4px 12px;
  background: transparent;
  border: none;
  font-size: 11px;
  font-family: inherit;
  color: #004894;
  cursor: pointer;
}

.nav-item.active {
  background: #0066cc;
  color: #fff;
  font-weight: bold;
}

.nav-item:hover:not(.active) {
  background: #d0d0c0;
}

.forum-alert {
  border: 1px solid #5d0e15;
  background: linear-gradient(90deg, rgba(111, 14, 25, 0.82) 0%, rgba(19, 8, 10, 0.98) 100%);
  color: #f0d3ce;
  padding: 10px 12px;
  line-height: 1.45;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.06), 0 2px 8px rgba(0, 0, 0, 0.18);
}

.forum-alert strong {
  color: #ffd1cb;
  text-transform: uppercase;
}

.forum-index {
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  gap: 10px;
  min-height: 0;
}

.forum-sidebar {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  border: 1px solid #4f1119;
  background: linear-gradient(180deg, rgba(24, 10, 13, 0.96) 0%, rgba(12, 8, 10, 0.98) 100%);
}

.sidebar-section {
  border: 1px solid #63202a;
  background: linear-gradient(180deg, rgba(54, 18, 24, 0.96) 0%, rgba(21, 10, 12, 0.98) 100%);
}

.sidebar-section--notice {
  padding-bottom: 6px;
}

.sidebar-section--notice p {
  margin: 0;
  padding: 0 8px 4px;
  color: #d3aea8;
  line-height: 1.4;
  font-size: 10px;
}

.sidebar-title {
  padding: 5px 8px;
  border-bottom: 1px solid #6f2f39;
  background: linear-gradient(180deg, #7c2430 0%, #4b1019 100%);
  color: #ffe3df;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06em;
}

.sidebar-links {
  display: flex;
  flex-direction: column;
  padding: 6px 4px 7px;
}

.sidebar-links a {
  padding: 3px 4px;
  color: #f0b1aa;
  text-decoration: none;
  line-height: 1.35;
}

.sidebar-links a:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.06);
}

.sidebar-links a.sidebar-link--active {
  color: #ffe3df;
  background: rgba(255, 255, 255, 0.12);
  font-weight: 600;
}

.forum-main {
  min-width: 0;
  padding: 10px;
  border: 1px solid #4d2a2e;
  background: linear-gradient(180deg, #d7d8dd 0%, #aeb4be 100%);
  color: #231b1d;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.4);
}

.forum-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  margin-bottom: 10px;
  border: 1px solid #7b5a5f;
  background: linear-gradient(180deg, #f8dde1 0%, #d7c1c5 100%);
}

.forum-logo {
  width: 28px;
  height: 28px;
  image-rendering: pixelated;
}

.forum-title {
  font-size: 16px;
  font-weight: 700;
  color: #47141e;
}

.forum-subtitle {
  font-size: 10px;
  color: #64494d;
  margin-top: 2px;
}

.forum-boards {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;
  margin-bottom: 10px;
}

.board-card {
  padding: 8px 9px;
  border: 1px solid #7c6f73;
  background: linear-gradient(180deg, #f8f1f3 0%, #d9d0d4 100%);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.6);
}

.board-card__title {
  color: #4a151d;
  font-weight: 700;
  margin-bottom: 3px;
}

.board-card__meta {
  color: #5b4a4d;
  line-height: 1.35;
  margin-bottom: 6px;
}

.board-card__stats {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  font-size: 10px;
  color: #7b666a;
}

.thread-list {
  width: 100%;
  border-collapse: collapse;
  background: #f7f6f8;
  border: 1px solid #7c6f73;
}

.header-row {
  background: linear-gradient(180deg, #d4d0c0 0%, #c0bcb0 100%);
  color: #491017;
  font-weight: 700;
}

.header-row td {
  padding: 6px 7px;
  border: 1px solid #6d444d;
  font-size: 10px;
  letter-spacing: 0.03em;
}

.thread-row {
  opacity: 0;
  transform: translateY(10px);
  transition:
    opacity 0.35s ease,
    transform 0.35s ease,
    background-color 0.2s ease;
  transition-delay: calc(var(--row-index) * 35ms);
}

.thread-row.visible {
  opacity: 1;
  transform: translateY(0);
}

.thread-row.alt {
  background: #ebe6e8;
}

.thread-row.sticky {
  background: #f2d5d8;
}

.thread-row:hover {
  background: #fff1d8;
}

.thread-row td {
  padding: 8px 7px;
  border: 1px solid #b3a8ab;
  vertical-align: top;
  /* Evitar que el contenido expanda la altura de la fila */
  height: 1px;
}

.col-topic {
  width: 54%;
}

.col-author {
  width: 12%;
}

.col-replies {
  width: 8%;
  text-align: center;
}

.col-views {
  width: 8%;
  text-align: center;
}

.col-last {
  width: 18%;
  font-size: 10px;
}

.thread-head {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 3px;
}

.thread-flag {
  display: inline-flex;
  align-items: center;
  padding: 1px 5px;
  border: 1px solid #7f3040;
  border-radius: 999px;
  background: rgba(122, 26, 43, 0.12);
  color: #721828;
  font-size: 9px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.thread-link {
  color: #002e68;
  text-decoration: none;
  font-weight: 700;
}

.thread-link.active,
.thread-link:hover {
  text-decoration: underline;
}

.thread-page-shell {
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #8b7e83;
  background: linear-gradient(180deg, #f7f2f4 0%, #e1d7db 100%);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.65),
    0 2px 8px rgba(0, 0, 0, 0.12);
}

.thread-page-topbar {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: center;
  padding: 0 0 10px;
  margin-bottom: 10px;
  border-bottom: 1px solid #b7a8ad;
}

.thread-page-crumbs {
  display: flex;
  gap: 6px;
  align-items: center;
  flex-wrap: wrap;
  color: #6b5258;
  font-size: 10px;
}

.crumb-link,
.back-link {
  border: 1px solid #9e8b91;
  background: linear-gradient(180deg, #fffefc 0%, #e8dde1 100%);
  color: #4c1c24;
  padding: 3px 8px;
  font-size: 10px;
  font-family: inherit;
  cursor: pointer;
}

.back-link {
  white-space: nowrap;
}

.thread-page-card {
  border: 1px solid #b79ea5;
  background: linear-gradient(180deg, #fffefe 0%, #efe5e9 100%);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.55);
}

.thread-page-header {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) 205px;
  gap: 12px;
  align-items: start;
  padding: 12px;
  border-bottom: 1px solid #c7b1b8;
  background: linear-gradient(180deg, #fffdfd 0%, #f3eaee 100%);
}

.thread-page-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 52px;
  padding: 4px 8px;
  border: 1px solid #8f6f77;
  background: linear-gradient(180deg, #fffefe 0%, #ded1d6 100%);
  color: #4c3138;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
}

.thread-page-titleblock h3 {
  margin: 0;
  color: #3d2931;
  font-size: 15px;
}

.thread-page-titleblock p {
  margin: 6px 0 0;
  color: #5f4950;
  line-height: 1.5;
  font-size: 12px;
}

.thread-page-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-start;
  padding: 8px 10px;
  border: 1px solid #c0abb1;
  background: linear-gradient(180deg, #fefcfd 0%, #eadfe3 100%);
  color: #5e4750;
  font-size: 10px;
}

.thread-page-body {
  display: block;
  padding: 12px;
}

.thread-post {
  border: 1px solid #b2a3a8;
  background: linear-gradient(180deg, #fffdfd 0%, #f1eaed 100%);
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.post-head {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: center;
  padding-bottom: 8px;
  margin-bottom: 10px;
  border-bottom: 1px dashed #c1afb5;
  color: #5e4750;
  font-size: 10px;
}

.post-head-meta {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.post-copy {
  margin: 0;
  color: #3d3034;
  line-height: 1.6;
  font-size: 12px;
}

.post-intro-row {
  display: block;
}

.post-intro-copy {
  flex: 1 1 auto;
  min-width: 0;
}

.post-inline-links {
  justify-content: flex-start;
  margin-top: 10px;
}

.thread-page-body-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.thread-page-links {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}

.thread-page-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 14px;
}

.thread-page-tech--inline {
  margin-top: 0;
}

.thread-tech-chip {
  display: inline-flex;
  align-items: center;
  padding: 3px 8px;
  border: 1px solid #9a8a90;
  background: linear-gradient(180deg, #fffefe 0%, #e6dce0 100%);
  color: #4b3940;
  font-size: 10px;
  font-weight: 700;
}

.thread-page-sidebar {
  align-self: start;
  border: 1px solid #9f858d;
  background: linear-gradient(180deg, #fcf8fa 0%, #e8dde1 100%);
  padding: 10px;
  box-shadow: inset 1px 1px 0 #fff, inset -1px -1px 0 #cab8be;
}

.thread-page-sidebar--inline {
  width: 190px;
  flex: 0 0 190px;
}

.thread-page-sidebar--header {
  padding: 8px;
}

.thread-page-sidebar--header .thread-page-preview-title {
  margin-bottom: 6px;
  padding-bottom: 4px;
}

.thread-page-sidebar--header .thread-page-meta--compact {
  margin-bottom: 6px;
  gap: 4px;
  padding: 6px;
}

.thread-page-meta--compact {
  margin-bottom: 10px;
  gap: 6px;
  padding: 8px;
  border: 1px solid #b9a4ab;
  background: linear-gradient(180deg, #fffefe 0%, #efe5e9 100%);
  color: #4d383f;
}

.thread-page-signature {
  padding-top: 10px;
  border-top: 1px dashed #bfa7ae;
}

.thread-page-signature--header {
  padding-top: 6px;
}

.thread-page-signature--header .signature-label {
  display: none;
}

.thread-page-signature--header .signature-banner {
  padding: 4px 8px;
  font-size: 10px;
}

.signature-label {
  display: block;
  margin-bottom: 6px;
  color: #6b4a54;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.signature-banner {
  padding: 8px 10px;
  border: 1px solid #8a6771;
  background: linear-gradient(180deg, #fffefe 0%, #e9dbe0 100%);
  color: #4f343d;
  font-family: 'Courier New', monospace;
  font-size: 11px;
  text-align: center;
}

.thread-page-preview-title {
  margin-bottom: 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid #bfa8af;
  color: #4d1821;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.thread-page-featured-wrap {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.thread-page-featured {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  padding: 0;
  border: 2px solid;
  border-color: #ffffff #80747a #80747a #ffffff;
  background: #f0f0f0;
  overflow: hidden;
  cursor: pointer;
}

.thread-page-featured:hover {
  border-color: #ffffff #5f5458 #5f5458 #ffffff;
}

.thread-page-featured img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.thread-page-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 8px;
  width: 100%;
}

.forum-shot {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 2px solid;
  border-color: #ffffff #80747a #80747a #ffffff;
  background: #f0f0f0;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.15s ease, border-color 0.15s ease;
  width: 100%;
  aspect-ratio: 16 / 9;
  min-height: 105px;
}

.forum-shot:hover {
  transform: scale(1.03);
  border-color: #ffffff #5f5458 #5f5458 #ffffff;
}

.forum-shot.active {
  border-color: #d82b4a #8b1b31 #8b1b31 #d82b4a;
  box-shadow: 0 0 0 1px rgba(216, 43, 74, 0.2);
}

.forum-shot img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.thread-page-empty {
  margin: 0;
  color: #745d63;
  font-size: 11px;
}

.image-viewer {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.82);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.image-viewer-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-viewer-content img {
  max-width: 90vw;
  max-height: 82vh;
  border: 3px solid #ffffff;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
}

.nav-button {
  position: absolute;
  background: #c0c0c0;
  border: 2px solid;
  border-color: #ffffff #808080 #808080 #ffffff;
  color: #000;
  font-weight: bold;
  cursor: pointer;
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-button span {
  position: relative;
  display: block;
  width: 10px;
  height: 10px;
}

.close-button span::before,
.close-button span::after {
  content: '';
  position: absolute;
  left: 1px;
  top: 4px;
  width: 8px;
  height: 2px;
  background: #000;
}

.close-button span::before {
  transform: rotate(45deg);
}

.close-button span::after {
  transform: rotate(-45deg);
}

.prev-button span::before,
.next-button span::before {
  content: '';
  position: absolute;
  top: 1px;
  border-top: 4px solid transparent;
  border-bottom: 4px solid transparent;
}

.prev-button span::before {
  left: 2px;
  border-right: 6px solid #000;
}

.next-button span::before {
  right: 2px;
  border-left: 6px solid #000;
}

.nav-button:active {
  border-color: #808080 #ffffff #ffffff #808080;
}

.prev-button {
  left: -46px;
  top: 50%;
  transform: translateY(-50%);
}

.next-button {
  right: -46px;
  top: 50%;
  transform: translateY(-50%);
}

.close-button {
  right: -8px;
  top: -44px;
}

.image-counter {
  position: absolute;
  bottom: -32px;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
  color: #fff;
  font-size: 11px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.85);
  white-space: nowrap;
}

.forum-detail-panel {
  margin-top: 10px;
  padding: 10px;
  border: 1px solid #7c6f73;
  background: linear-gradient(180deg, #f6f0f2 0%, #ded4d8 100%);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.55);
}

.forum-detail-panel--hint {
  color: #5e4750;
}

.forum-detail-head {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
}

.forum-detail-kicker {
  color: #7f3040;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.forum-detail-head h4 {
  margin: 4px 0 6px;
  color: #3f1019;
  font-size: 14px;
}

.forum-detail-head p {
  margin: 0;
  color: #4f3e42;
  line-height: 1.45;
}

.forum-detail-meta {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 160px;
  font-size: 10px;
  color: #6b565b;
  text-align: right;
}

.forum-detail-links {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.detail-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 110px;
  padding: 5px 10px;
  border: 1px solid #7f3040;
  background: linear-gradient(180deg, #fff7f8 0%, #e4cfd4 100%);
  color: #5a1520;
  text-decoration: none;
  font-size: 11px;
  font-weight: 700;
}

.detail-link:hover {
  background: linear-gradient(180deg, #ffffff 0%, #efdfe2 100%);
  text-decoration: underline;
}

.forum-detail-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 8px;
  margin-top: 10px;
}


.thread-category {
  font-size: 10px;
  color: #6c5c60;
}

.last-message-meta {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
}

.last-message-badge {
  display: inline-flex;
  align-items: center;
  padding: 1px 5px;
  border: 1px solid #6a5aa2;
  border-radius: 2px;
  background: linear-gradient(180deg, #efeaff 0%, #d8d0ff 100%);
  color: #3f3368;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.last-message-badge--private {
  border-color: #6a3f59;
  background: linear-gradient(180deg, #ffeef6 0%, #f3d4e4 100%);
  color: #5f2443;
}

.last-message-badge--corrupt {
  border-color: #6c5a2a;
  background: linear-gradient(180deg, #fff8df 0%, #ead59b 100%);
  color: #5a4312;
}

.last-author {
  color: #755f64;
  margin-top: 2px;
}

.no-threads {
  text-align: center;
  padding: 0;
  color: #6d5c60;
}

.empty-state {
  padding: 28px 20px 24px;
}

.empty-state-icon {
  font-size: 32px;
  margin-bottom: 8px;
  opacity: 0.7;
}

.empty-state-title {
  font-weight: bold;
  font-size: 13px;
  color: #5f4a4f;
  margin-bottom: 6px;
}

.empty-state-text {
  font-size: 11px;
  color: #8d7c81;
  line-height: 1.6;
}

.forum-footer {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  margin-top: 10px;
  padding: 6px 8px;
  border: 1px solid #7c6f73;
  background: linear-gradient(180deg, #efe9eb 0%, #d6cdd1 100%);
  color: #5f4a4f;
}

.footer-info {
  color: inherit;
}

.footer-separator {
  color: #8d7c81;
}

.forum-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 8px;
  background: #f0f0e8;
  border-top: 1px solid #a8a8a8;
}

.page-btn {
  padding: 2px 8px;
  background: #fff;
  border: 1px solid #a8a8a8;
  font-size: 11px;
  cursor: pointer;
}

.page-btn:hover:not(:disabled) {
  background: #e8e8d0;
}

.page-current {
  padding: 2px 6px;
  font-weight: bold;
  color: #0066cc;
}

.forum-stats-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  padding: 6px 8px;
  background: #e8e8f0;
  border: 1px solid #a8a8a8;
  font-size: 11px;
  color: #333;
}

.forum-stats-bar .sep {
  color: #a8a8a8;
}

.forum-status-bar {
  height: 22px;
  background: #e8e8d0;
  border-top: 1px solid #a8a8a8;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 8px;
  font-size: 11px;
  color: #333;
}

.forum-status-bar .sep {
  color: #a8a8a8;
}

.online-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 6px 8px;
}

.online-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  color: #f2e9ed;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.45);
}

.online-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.45);
}

.online-dot.guest {
  background: #9ca3af;
}

.search-view {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.search-header {
  border: 1px solid #7c6f73;
  background: linear-gradient(180deg, #f8f1f3 0%, #d9d0d4 100%);
  padding: 12px;
}

.search-title {
  font-size: 14px;
  font-weight: 700;
  color: #47141e;
  margin-bottom: 8px;
}

.search-input-wrap {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.search-input {
  flex: 1;
  min-width: 220px;
  height: 30px;
  padding: 0 10px;
  border: 2px solid;
  border-color: #ffffff #8ea8c9 #8ea8c9 #ffffff;
  background: #fff;
  font-family: Tahoma, 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
  line-height: 1;
  color: #333;
  outline: none;
}

.search-input:focus {
  border-color: #6c2230;
  background: #fffdfd;
}

.search-select {
  min-width: 190px;
  height: 30px;
  padding: 0 28px 0 8px;
  border: 2px solid;
  border-color: #ffffff #8ea8c9 #8ea8c9 #ffffff;
  background: #fff;
  background-image: linear-gradient(45deg, transparent 50%, #6c2230 50%), linear-gradient(135deg, #6c2230 50%, transparent 50%);
  background-position: calc(100% - 13px) 12px, calc(100% - 8px) 12px;
  background-size: 5px 5px, 5px 5px;
  background-repeat: no-repeat;
  appearance: none;
  font-family: Tahoma, 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
  line-height: 1;
  color: #333;
}

.search-clear-btn {
  height: 30px;
  padding: 0 10px;
  border: 2px solid;
  border-color: #ffffff #7d6f74 #7d6f74 #ffffff;
  background: linear-gradient(180deg, #f9f4f6 0%, #ddd2d7 100%);
  color: #4d1821;
  font-family: Tahoma, 'MS Sans Serif', Arial, sans-serif;
  font-size: 11px;
  line-height: 1;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;
}

.search-clear-btn:active {
  border-color: #7d6f74 #ffffff #ffffff #7d6f74;
}

.search-results-count {
  font-size: 11px;
  color: #5e4750;
  padding: 4px 0;
}

.search-empty {
  text-align: center;
  padding: 40px 20px;
  color: #7b666a;
  font-size: 12px;
}

.profile-view {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.profile-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px;
  border: 1px solid #7c6f73;
  background: linear-gradient(180deg, #f8f1f3 0%, #d9d0d4 100%);
}

.profile-avatar {
  width: 56px;
  height: 56px;
  border-radius: 4px;
  background: linear-gradient(180deg, #ffcf7d, #f3a33e);
  border: 2px solid #7f3f10;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
  color: #5f3200;
  flex-shrink: 0;
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-size: 16px;
  font-weight: 700;
  color: #3d2931;
}

.profile-role {
  font-size: 11px;
  color: #6b565b;
  margin-top: 2px;
}

.profile-stats {
  display: flex;
  gap: 16px;
  margin-top: 8px;
  font-size: 11px;
  color: #5e4750;
}

.profile-bio {
  padding: 10px 12px;
  border: 1px solid #b2a3a8;
  background: linear-gradient(180deg, #fffdfd 0%, #f1eaed 100%);
  font-size: 12px;
  color: #3d3034;
  line-height: 1.6;
}

.profile-bio p {
  margin: 0;
}

.profile-section {
  padding: 10px 12px;
  border: 1px solid #b2a3a8;
  background: linear-gradient(180deg, #fffdfd 0%, #f1eaed 100%);
}

.profile-section-title {
  font-size: 11px;
  font-weight: 700;
  color: #4d1821;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.profile-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.admin-view {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.admin-warning {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid #8f6f00;
  background: linear-gradient(90deg, rgba(255, 230, 0, 0.08) 0%, rgba(255, 200, 0, 0.04) 100%);
}

.admin-warning-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.admin-warning-text {
  flex: 1;
}

.admin-warning-text strong {
  display: block;
  color: #5f4500;
  font-size: 12px;
}

.admin-warning-text p {
  margin: 3px 0 0;
  color: #7a6200;
  font-size: 11px;
}

.admin-panel {
  border: 1px solid #7c6f73;
  background: linear-gradient(180deg, #f8f1f3 0%, #d9d0d4 100%);
  padding: 14px;
}

.admin-panel-title {
  font-size: 13px;
  font-weight: 700;
  color: #3d2931;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #b2a3a8;
}

.admin-stats {
  display: flex;
  gap: 20px;
  margin-bottom: 14px;
}

.admin-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  padding: 10px;
  border: 1px solid #b2a3a8;
  background: linear-gradient(180deg, #fffdfd 0%, #efe5e9 100%);
}

.admin-stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #3d2931;
}

.admin-stat-label {
  font-size: 10px;
  color: #6b565b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 2px;
}

.admin-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.admin-btn {
  flex: 1;
  min-width: 120px;
  padding: 8px 12px;
  border: 2px solid;
  border-color: #ffffff #8ea8c9 #8ea8c9 #ffffff;
  background: linear-gradient(180deg, #fefefe 0%, #dfeaf8 100%);
  color: #14355f;
  font-family: inherit;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  text-align: center;
}

.admin-btn:hover {
  background: linear-gradient(180deg, #ffffff 0%, #ebf2fb 100%);
}

.admin-btn:active {
  border-color: #8ea8c9 #ffffff #ffffff #8ea8c9;
}

.profile-view {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 1px solid #85767b;
  background: linear-gradient(180deg, #f8f1f3 0%, #d9d0d4 100%);
}

.profile-avatar-lg {
  width: 72px;
  height: 72px;
  border-radius: 6px;
  background: linear-gradient(180deg, #ffcf7d 0%, #f3a33e 100%);
  border: 3px solid #7f3f10;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 700;
  color: #5f3200;
  flex-shrink: 0;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.4);
}

.profile-header-info {
  flex: 1;
}

.profile-fullname {
  font-size: 20px;
  font-weight: 700;
  color: #3d2931;
  line-height: 1.2;
}

.profile-subtitle {
  font-size: 12px;
  color: #6b565b;
  margin-top: 4px;
}

.profile-location {
  font-size: 11px;
  color: #5e4750;
  margin-top: 6px;
}

.profile-contact-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid #b2a3a8;
  background: linear-gradient(180deg, #f6f0f2 0%, #ded4d8 100%);
  font-size: 11px;
}

.contact-item {
  color: #004894;
  text-decoration: none;
}

.contact-item:hover {
  text-decoration: underline;
}

.contact-sep {
  color: #a8a8a8;
}

.profile-section-block {
  border: 1px solid #85767b;
  background: linear-gradient(180deg, #fffdfd 0%, #f1eaed 100%);
}

.profile-section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: linear-gradient(180deg, #e8dade 0%, #d9cdd4 100%);
  border-bottom: 1px solid #b2a3a8;
}

.section-icon {
  font-size: 14px;
}

.section-title {
  font-size: 12px;
  font-weight: 700;
  color: #3d2931;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.profile-section-body {
  padding: 12px;
  font-size: 12px;
  color: #3d3034;
  line-height: 1.6;
}

.skill-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.skill-category {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.skill-cat-label {
  font-size: 10px;
  font-weight: 700;
  color: #5e4750;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.skill-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.skill-chips .thread-tech-chip {
  background: linear-gradient(180deg, #fffdfd 0%, #e6dce0 100%);
  border: 1px solid #9a8a90;
  color: #4b3940;
  padding: 2px 7px;
  font-size: 10px;
  border-radius: 3px;
}

.experience-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.exp-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
}

.exp-title {
  font-weight: 700;
  font-size: 12px;
  color: #47141e;
}

.exp-date {
  font-size: 10px;
  color: #7b666a;
  flex-shrink: 0;
}

.exp-desc {
  font-size: 11px;
  color: #59464b;
  line-height: 1.5;
}

.tech-tag {
  font-weight: 700;
  color: #6d28d9;
}

.experience-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, #c1afb5, transparent);
  margin: 10px 0;
}

.edu-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 6px;
}

.edu-degree {
  font-weight: 700;
  font-size: 12px;
  color: #3d2931;
}

.edu-meta {
  font-size: 10px;
  color: #6b565b;
}

.cert-items {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 6px;
}

.cert-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: #5e4750;
}

.cert-icon {
  font-size: 11px;
}

.languages-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.lang-badge {
  padding: 3px 10px;
  border: 1px solid #9a8a90;
  background: linear-gradient(180deg, #fffdfd 0%, #e6dce0 100%);
  color: #4b3940;
  font-size: 11px;
  border-radius: 3px;
}

.admin-view {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.admin-locked {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  border: 1px solid #8f6f00;
  background: linear-gradient(90deg, rgba(255, 230, 0, 0.06) 0%, rgba(255, 200, 0, 0.03) 100%);
}

.admin-lock-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.admin-lock-content {
  flex: 1;
}

.admin-lock-title {
  font-size: 14px;
  font-weight: 700;
  color: #5f4500;
  margin-bottom: 4px;
}

.admin-lock-msg {
  font-size: 11px;
  color: #7a6200;
  line-height: 1.5;
}

.admin-form-placeholder {
  border: 1px solid #85767b;
  background: linear-gradient(180deg, #f8f1f3 0%, #d9d0d4 100%);
  padding: 14px;
}

.admin-form-header {
  font-size: 13px;
  font-weight: 700;
  color: #3d2931;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #b2a3a8;
}

.admin-form-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form-field label {
  font-size: 11px;
  font-weight: 700;
  color: #5e4750;
}

.form-input {
  padding: 6px 8px;
  border: 2px solid;
  border-color: #ffffff #8ea8c9 #8ea8c9 #ffffff;
  background: #fffdfd;
  font-family: inherit;
  font-size: 12px;
  color: #333;
  outline: none;
}

.form-input:disabled {
  background: #f0f0e8;
  color: #9e8b91;
  cursor: not-allowed;
}

.admin-submit-btn {
  padding: 8px 16px;
  border: 2px solid;
  border-color: #ffffff #8ea8c9 #8ea8c9 #ffffff;
  background: linear-gradient(180deg, #fefefe 0%, #dfeaf8 100%);
  color: #808080;
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  cursor: not-allowed;
  opacity: 0.6;
  align-self: flex-start;
}

.admin-form-note {
  margin-top: 8px;
  font-size: 10px;
  color: #7b666a;
  text-align: center;
}

@media (max-width: 1100px) {
  .forum-index {
    grid-template-columns: 1fr;
  }

  .forum-boards {
    grid-template-columns: 1fr;
  }

  .forum-account {
    max-width: none;
  }

  .forum-nav {
    flex-wrap: wrap;
  }

  .forum-stats-bar,
  .forum-status-bar {
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

@media (max-width: 768px) {
  .thread-page-header {
    grid-template-columns: auto 1fr;
    grid-template-rows: auto auto auto;
    gap: 8px;
  }

  .thread-page-badge {
    grid-row: 1;
    grid-column: 1;
    align-self: start;
  }

  .thread-page-titleblock {
    grid-row: 1;
    grid-column: 2;
    min-width: 0;
    overflow: hidden;
  }

  .thread-page-titleblock h3 {
    overflow-wrap: break-word;
  }

  .thread-page-sidebar--inline {
    grid-column: 1 / -1;
    grid-row: 2;
    width: 100%;
  }

  .thread-page-gallery {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
