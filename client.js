window.__ModuleLoader__.load({
  id: '@local/dsh-plugin-manager',
  factory(require) {
    const React = require('react');
    const h = React.createElement;
    const { useState, useEffect, useCallback, useMemo } = React;

    const NS = 'dshPluginManager';
    const PANEL_ID = 'dsh-plugin-manager';
    const OUR_PACKAGE = '@local/dsh-plugin-manager';

    const ZH = {
      nav: '插件管理',
      title: '插件管理器',
      subtitle: '全部非 DSH 原生插件：市场 / npm / GitHub / 本地自编',
      refresh: '刷新',
      loading: '正在读取插件列表…',
      loadFailed: '读取失败',
      empty: '没有已安装的第三方插件',
      enabled: '已启用',
      disabled: '已停用',
      enable: '启用',
      disable: '停用',
      uninstall: '卸载',
      confirmUninstall: '确认卸载',
      cancel: '取消',
      components: '组件',
      running: '运行中',
      stopped: '未加载',
      phaseFailed: '启动失败',
      noDescription: '无描述',
      sourceNpm: 'npm 市场',
      sourceGithub: 'GitHub 直装',
      sourceLocal: '本地自编',
      sourceOfficial: '官方',
      sourceUnknown: '未知来源',
      count: '共 {n} 个',
      applied: '已生效',
      restartRequired: '已保存，重启 DSH 后生效',
      overridden: '已被更上层配置覆盖',
      failed: '操作失败',
      done: '已完成',
      readOnly: '此项不可通过插件补丁修改',
      nativeHidden: 'DSH 原生组件已隐藏',
      confirmTip: '卸载会移除该依赖，插件文件与数据可能保留',
      noAccess: '远端插件服务不可用，暂时无法管理插件',
      unknownError: '未知错误',
      openTip: '打开插件管理器',
      toggleTip: '启用 / 停用该插件',
    };

    const EN = {
      nav: 'Plugins',
      title: 'Plugin Manager',
      subtitle: 'Every non-native DSH plugin: market / npm / GitHub / locally authored',
      refresh: 'Refresh',
      loading: 'Reading plugin inventory…',
      loadFailed: 'Failed to load',
      empty: 'No third-party plugins installed',
      enabled: 'Enabled',
      disabled: 'Disabled',
      enable: 'Enable',
      disable: 'Disable',
      uninstall: 'Uninstall',
      confirmUninstall: 'Confirm uninstall',
      cancel: 'Cancel',
      components: 'Components',
      running: 'Running',
      stopped: 'Not loaded',
      phaseFailed: 'Failed to start',
      noDescription: 'No description',
      sourceNpm: 'npm registry',
      sourceGithub: 'GitHub',
      sourceLocal: 'Local build',
      sourceOfficial: 'Official',
      sourceUnknown: 'Unknown source',
      count: '{n} total',
      applied: 'Applied',
      restartRequired: 'Saved — restart DSH to apply',
      overridden: 'Overridden by a higher layer',
      failed: 'Operation failed',
      done: 'Done',
      readOnly: 'This row cannot be changed through the profile patch',
      nativeHidden: 'Built-in DSH rows are hidden',
      confirmTip: 'Uninstall removes the dependency; plugin files and data may remain',
      noAccess: 'The remote plugin service is unavailable, so plugins cannot be managed here',
      unknownError: 'Unknown error',
      openTip: 'Open the plugin manager',
      toggleTip: 'Enable or disable this plugin',
    };

    const CSS = [
      '.dpm-entry{box-sizing:border-box;display:flex;align-items:center;gap:8px;width:calc(100% + 4px);height:42px;margin:4px -2px;padding:0 10px 0 8px;border:0;border-radius:12px;background:transparent;color:var(--dsw-alias-label-primary);font:inherit;font-size:14px;line-height:22px;cursor:pointer;overflow:hidden;text-align:left}',
      '.dpm-entry:hover{background:var(--dsw-alias-bg-layer-2)}',
      '.dpm-entry svg{flex:none;width:16px;height:16px}',
      '.dpm-entry span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
      '.dpm-entry.rail{width:36px;height:36px;margin:8px auto 10px;padding:0;justify-content:center;border-radius:50%;gap:0}',
      '.dpm-entry.rail svg{width:18px;height:18px}',
      '.dpm-page{box-sizing:border-box;height:100%;overflow:auto;padding:22px 28px 48px;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font-size:13px;line-height:1.5}',
      '.dpm-header{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin:0 0 18px}',
      '.dpm-h1{margin:0;font-size:20px;font-weight:600;letter-spacing:.2px}',
      '.dpm-sub{margin:4px 0 0;font-size:12px;color:var(--dsw-alias-label-secondary)}',
      '.dpm-header-actions{display:flex;align-items:center;gap:10px;flex:none}',
      '.dpm-count{font-size:12px;color:var(--dsw-alias-label-secondary);font-variant-numeric:tabular-nums}',
      '.dpm-btn{appearance:none;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);border-radius:8px;padding:4px 10px;font:inherit;font-size:12px;cursor:pointer}',
      '.dpm-btn:hover{background:var(--dsw-alias-bg-layer-2)}',
      '.dpm-btn:disabled{opacity:.5;cursor:default}',
      '.dpm-btn.danger{color:var(--dsw-alias-state-error-primary);border-color:var(--dsw-alias-state-error-primary)}',
      '.dpm-btn.danger.confirm{background:var(--dsw-alias-state-error-primary);color:var(--dsw-alias-bg-base)}',
      '.dpm-list{display:flex;flex-direction:column;gap:12px;max-width:920px}',
      '.dpm-card{display:flex;gap:12px;padding:14px 16px;border:1px solid var(--dsw-alias-border-l1);border-radius:14px;background:var(--dsw-alias-bg-layer-1)}',
      '.dpm-card.off{opacity:.74}',
      '.dpm-card-body{flex:1;min-width:0}',
      '.dpm-head{display:flex;align-items:center;gap:8px;flex-wrap:wrap}',
      '.dpm-title{font-size:14px;font-weight:600;overflow-wrap:anywhere}',
      '.dpm-ver,.dpm-badge{font-size:11px;padding:1px 7px;border-radius:999px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-secondary);font-variant-numeric:tabular-nums}',
      '.dpm-badge.local{color:var(--dsw-alias-state-warn-primary)}',
      '.dpm-badge.github{color:var(--dsw-alias-brand-primary)}',
      '.dpm-state{font-size:11px;color:var(--dsw-alias-label-secondary)}',
      '.dpm-state.on{color:var(--dsw-alias-state-success-primary)}',
      '.dpm-pkg{margin-top:2px;font-size:11px;color:var(--dsw-alias-label-secondary);font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;overflow-wrap:anywhere}',
      '.dpm-desc{margin:8px 0 0;font-size:12px;color:var(--dsw-alias-label-secondary);display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden;overflow-wrap:anywhere}',
      '.dpm-warn{margin:8px 0 0;font-size:12px;color:var(--dsw-alias-state-warn-primary);overflow-wrap:anywhere}',
      '.dpm-actions{display:flex;align-items:center;gap:8px;margin-top:10px;flex-wrap:wrap}',
      '.dpm-switch{position:relative;width:38px;height:20px;flex:none;border:0;border-radius:999px;background:var(--dsw-alias-border-l2);cursor:pointer;transition:background .15s;padding:0}',
      '.dpm-switch[aria-checked="true"]{background:var(--dsw-alias-brand-primary)}',
      '.dpm-switch::after{content:"";position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:var(--dsw-alias-bg-base);transition:transform .15s}',
      '.dpm-switch[aria-checked="true"]::after{transform:translateX(18px)}',
      '.dpm-switch:disabled{opacity:.55;cursor:default}',
      '.dpm-rows{margin-top:10px;border-top:1px dashed var(--dsw-alias-border-l1);padding-top:8px;display:flex;flex-direction:column;gap:6px}',
      '.dpm-row{display:flex;align-items:center;gap:8px;font-size:12px;color:var(--dsw-alias-label-secondary)}',
      '.dpm-row-name{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}',
      '.dpm-row-phase{flex:none;font-size:11px}',
      '.dpm-empty{margin-top:32px;color:var(--dsw-alias-label-secondary);font-size:13px}',
      '.dpm-error{margin:0 0 14px;padding:10px 12px;border-radius:10px;border:1px solid var(--dsw-alias-state-error-primary);color:var(--dsw-alias-state-error-primary);font-size:12px;overflow-wrap:anywhere}',
      '.dpm-toast{position:sticky;bottom:16px;margin:18px 0 0;display:inline-block;padding:8px 12px;border-radius:10px;background:var(--dsw-alias-bg-overlay);border:1px solid var(--dsw-alias-border-l1);font-size:12px;color:var(--dsw-alias-label-primary);box-shadow:0 6px 20px rgba(0,0,0,.12)}',
      '.dpm-toast.err{color:var(--dsw-alias-state-error-primary);border-color:var(--dsw-alias-state-error-primary)}',
    ].join('\n');

    function ensureCss() {
      const id = 'dsh-plugin-manager-style';
      if (typeof document === 'undefined') return () => {};
      if (document.getElementById(id)) return () => {};
      const el = document.createElement('style');
      el.id = id;
      el.textContent = CSS;
      document.head.appendChild(el);
      return () => {
        if (el.parentNode) el.parentNode.removeChild(el);
      };
    }

    function readLocaleId(ctx) {
      try {
        const snap = ctx.locale.getSnapshot();
        return (snap && (snap.locale || snap.id || snap.current)) || 'zh';
      } catch (err) {
        return 'zh';
      }
    }

    function useLocaleId(ctx) {
      const [id, setId] = useState(() => readLocaleId(ctx));
      useEffect(() => {
        let off;
        try {
          off = ctx.locale.subscribe(() => setId(readLocaleId(ctx)));
        } catch (err) {
          off = undefined;
        }
        return () => {
          if (typeof off === 'function') off();
        };
      }, [ctx]);
      return id;
    }

    function localize(value, localeId) {
      if (value === null || value === undefined) return '';
      if (typeof value === 'string') return value;
      if (typeof value === 'object') {
        const pick = value[localeId] || value.zh || value.en;
        if (pick) return String(pick);
        const keys = Object.keys(value);
        return keys.length ? String(value[keys[0]]) : '';
      }
      return String(value);
    }

    function fmt(template, n) {
      return String(template).replace('{n}', String(n));
    }

    function sourceKind(bundle) {
      const src = String(bundle.source || '');
      if (src.indexOf('link:') === 0) return 'local';
      if (src.indexOf('github:') === 0) return 'github';
      if (src) return 'npm';
      if (bundle.official) return 'official';
      return 'unknown';
    }

    function sourceLabel(kind, t) {
      if (kind === 'local') return t('sourceLocal');
      if (kind === 'github') return t('sourceGithub');
      if (kind === 'npm') return t('sourceNpm');
      if (kind === 'official') return t('sourceOfficial');
      return t('sourceUnknown');
    }

    function describeResult(res, t) {
      if (!res || typeof res !== 'object') return t('done');
      if (res.error && (!res.application || res.application === 'failed')) {
        return res.error.diagnostic || res.error.code || t('failed');
      }
      switch (res.application) {
        case 'applied':
          return t('applied');
        case 'restart-required':
          return t('restartRequired');
        case 'overridden':
          return t('overridden');
        case 'failed':
          return (res.error && (res.error.diagnostic || res.error.code)) || t('failed');
        case 'cancelled':
          return t('cancel');
        default:
          return t('done');
      }
    }

    function withTimeout(promise, ms) {
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error('timeout')), ms);
        promise.then(
          (value) => {
            clearTimeout(timer);
            resolve(value);
          },
          (err) => {
            clearTimeout(timer);
            reject(err);
          }
        );
      });
    }

    async function callRemote(api, method, args) {
      const result = await api[method].apply(api, args || []);
      if (result && typeof result === 'object' && typeof result.ok === 'boolean') {
        if (!result.ok) {
          const remoteError = result.error || {};
          const error = new Error(remoteError.diagnostic || remoteError.message || remoteError.code || 'remote call failed');
          error.remote = remoteError;
          throw error;
        }
        return result.value;
      }
      return result;
    }

    function useInventory(getApi) {
      const [state, setState] = useState({ loading: true, error: null, bundles: [], plugins: [] });
      const getRef = React.useRef(getApi);
      getRef.current = getApi;
      const load = useCallback(async () => {
        let api;
        try {
          api = getRef.current();
        } catch (err) {
          api = undefined;
        }
        if (!api) {
          setState({ loading: false, error: 'unavailable', bundles: [], plugins: [] });
          return;
        }
        setState((prev) => ({ ...prev, loading: true, error: null }));
        try {
          const results = await withTimeout(
            Promise.all([
              callRemote(api, 'listBundles'),
              callRemote(api, 'listPlugins'),
            ]),
            20000
          );
          setState({
            loading: false,
            error: null,
            bundles: Array.isArray(results[0]) ? results[0] : [],
            plugins: Array.isArray(results[1]) ? results[1] : [],
          });
        } catch (err) {
          setState({
            loading: false,
            error: String((err && err.message) || err),
            bundles: [],
            plugins: [],
          });
        }
      }, []);
      useEffect(() => {
        load();
      }, [load]);
      return [state, load];
    }

    function PluginSwitch(props) {
      return h('button', {
        type: 'button',
        className: 'dpm-switch',
        role: 'switch',
        'aria-checked': props.checked ? 'true' : 'false',
        'aria-label': props.label,
        title: props.label,
        disabled: props.disabled,
        onClick: props.onClick,
      });
    }

    function RowLine(props) {
      const { row, live, t, localeId, pending, onToggle } = props;
      const title = localize(row.meta && row.meta.title, localeId) || row.moduleName || row.rowId;
      let phase = '';
      if (!live) phase = t('stopped');
      else if (live.fiberPhase === 'active') phase = t('running');
      else if (live.fiberPhase === 'failed') phase = t('phaseFailed');
      const addressable = !!(live && live.patchId);
      return h(
        'div',
        { className: 'dpm-row' },
        h('span', { className: 'dpm-row-name', title: row.moduleName || row.rowId }, title),
        phase ? h('span', { className: 'dpm-row-phase' }, phase) : null,
        live
          ? h(PluginSwitch, {
              checked: !!live.enabled,
              label: t('toggleTip'),
              disabled: pending || !addressable,
              onClick: () => {
                if (addressable) onToggle(live);
              },
            })
          : null
      );
    }

    function PluginCard(props) {
      const { bundle, liveRows, t, localeId, pending, confirming, setConfirming, expanded, onExpand, onToggle, onRemove, onToggleRow } = props;
      const title = localize(bundle.meta && bundle.meta.title, localeId) || bundle.name;
      const description = localize(bundle.meta && bundle.meta.description, localeId) || bundle.description || '';
      const kind = sourceKind(bundle);
      const rows = Array.isArray(bundle.rows) ? bundle.rows : [];
      const rowsVisible = expanded;
      const error = bundle.error;
      const removable = !!bundle.removable;
      const isConfirming = confirming === bundle.name;
      return h(
        'article',
        { className: 'dpm-card' + (bundle.enabled ? '' : ' off') },
        h(
          'div',
          { className: 'dpm-card-body' },
          h(
            'div',
            { className: 'dpm-head' },
            h('span', { className: 'dpm-title' }, title),
            bundle.version ? h('span', { className: 'dpm-ver' }, 'v' + bundle.version) : null,
            h('span', { className: 'dpm-badge ' + kind }, sourceLabel(kind, t)),
            h('span', { className: 'dpm-state' + (bundle.enabled ? ' on' : '') }, bundle.enabled ? t('enabled') : t('disabled'))
          ),
          h('div', { className: 'dpm-pkg' }, bundle.name),
          h('p', { className: 'dpm-desc' }, description || t('noDescription')),
          error
            ? h(
                'p',
                { className: 'dpm-warn' },
                (error.code ? error.code + ' · ' : '') +
                  (error.diagnostic ||
                    ((error.incompatible && error.incompatible[0] && error.incompatible[0].requirements && error.incompatible[0].requirements['engines.dsh']) || '')
                  )
              )
            : null,
          h(
            'div',
            { className: 'dpm-actions' },
            h(PluginSwitch, {
              checked: !!bundle.enabled,
              label: t('toggleTip'),
              disabled: !!pending,
              onClick: () => onToggle(bundle),
            }),
            rows.length
              ? h(
                  'button',
                  {
                    type: 'button',
                    className: 'dpm-btn',
                    onClick: () => onExpand(bundle.name),
                  },
                  t('components') + ' (' + rows.length + ')'
                )
              : null,
            h(
              'button',
              {
                type: 'button',
                className: 'dpm-btn danger' + (isConfirming ? ' confirm' : ''),
                disabled: !!pending || (!removable && !isConfirming),
                title: removable ? t('confirmTip') : t('readOnly'),
                onClick: () => {
                  if (!removable) return;
                  if (!isConfirming) {
                    setConfirming(bundle.name);
                    return;
                  }
                  setConfirming(null);
                  onRemove(bundle);
                },
              },
              isConfirming ? t('confirmUninstall') : t('uninstall')
            ),
            isConfirming
              ? h(
                  'button',
                  { type: 'button', className: 'dpm-btn', onClick: () => setConfirming(null) },
                  t('cancel')
                )
              : null
          ),
          rowsVisible && rows.length
            ? h(
                'div',
                { className: 'dpm-rows' },
                rows.map((row) =>
                  h(RowLine, {
                    key: (row.entryId || row.rowId || row.moduleName) + '',
                    row,
                    live: liveRows.get(row.entryId),
                    t,
                    localeId,
                    pending: !!pending,
                    onToggle: onToggleRow,
                  })
                )
              )
            : null
        )
      );
    }

    class PanelBoundary extends React.Component {
      constructor(props) {
        super(props);
        this.state = { error: null };
      }
      static getDerivedStateFromError(error) {
        return { error };
      }
      componentDidCatch(error, info) {
        console.error('[dsh-plugin-manager] panel crashed', error, info);
      }
      render() {
        if (this.state.error) {
          const err = this.state.error;
          return h(
            'div',
            { className: 'dpm-page' },
            h('div', { className: 'dpm-error' }, String((err && err.stack) || err))
          );
        }
        return this.props.children;
      }
    }

    function resolveRemote(ctx) {
      try {
        if (ctx && typeof ctx.get === 'function') return ctx.get('remote');
      } catch (err) {
        return undefined;
      }
      return undefined;
    }

    function resolveApi(ctx) {
      const remote = resolveRemote(ctx);
      return remote && remote.pluginManager ? remote.pluginManager : undefined;
    }

    function ManagerPage(props) {
      const { t, ctx } = props;
      const remote = resolveRemote(ctx);
      const api = useMemo(() => resolveApi(ctx), [ctx]);
      const getApi = useCallback(() => resolveApi(ctx), [ctx]);
      const localeId = useLocaleId(ctx);
      const [inventory, reload] = useInventory(getApi);
      const [pending, setPending] = useState(null);
      const [confirming, setConfirming] = useState(null);
      const [expanded, setExpanded] = useState({});
      const [toast, setToast] = useState(null);

      useEffect(() => {
        if (!toast) return undefined;
        const timer = setTimeout(() => setToast(null), 4200);
        return () => clearTimeout(timer);
      }, [toast]);

      const hadApi = React.useRef(!!api);
      useEffect(() => {
        if (api && !hadApi.current) {
          hadApi.current = true;
          reload();
        }
        if (api) hadApi.current = true;
      }, [api, reload]);

      const liveByEntry = useMemo(() => {
        const map = new Map();
        for (const plugin of inventory.plugins) {
          if (plugin && plugin.entryId) map.set(plugin.entryId, plugin);
        }
        return map;
      }, [inventory.plugins]);

      const items = useMemo(() => {
        const list = inventory.bundles.filter(
          (bundle) => bundle && bundle.availability === 'profile' && bundle.installed !== false
        );
        list.sort((a, b) => {
          const ae = a.enabled ? 0 : 1;
          const be = b.enabled ? 0 : 1;
          if (ae !== be) return ae - be;
          return String(a.name).localeCompare(String(b.name));
        });
        return list;
      }, [inventory.bundles]);

      const runAction = useCallback(
        async (key, action) => {
          if (!api || pending) return;
          setPending(key);
          try {
            const res = await action();
            const failed = !!res && res.application === 'failed';
            setToast({ kind: failed ? 'err' : 'ok', text: describeResult(res, t) });
            await reload();
          } catch (err) {
            setToast({ kind: 'err', text: String((err && err.message) || err) });
          } finally {
            setPending(null);
          }
        },
        [api, pending, reload, t]
      );

      const toggleBundle = useCallback(
        (bundle) =>
          runAction(bundle.name, () =>
            callRemote(api, 'setBundleEnabled', [bundle.name, !bundle.enabled])
          ),
        [api, runAction]
      );

      const removeBundle = useCallback(
        (bundle) => runAction(bundle.name, () => callRemote(api, 'removeBundle', [bundle.name])),
        [api, runAction]
      );

      const toggleRow = useCallback(
        (live) =>
          runAction(live.entryId, () =>
            callRemote(api, 'setPluginEnabled', [live.entryId, !live.enabled])
          ),
        [api, runAction]
      );

      return h(
        'div',
        { className: 'dpm-page' },
        h(
          'header',
          { className: 'dpm-header' },
          h(
            'div',
            null,
            h('h1', { className: 'dpm-h1' }, t('title')),
            h('p', { className: 'dpm-sub' }, t('subtitle'))
          ),
          h(
            'div',
            { className: 'dpm-header-actions' },
            h('span', { className: 'dpm-count' }, fmt(t('count'), items.length)),
            h(
              'button',
              {
                type: 'button',
                className: 'dpm-btn',
                disabled: inventory.loading,
                onClick: () => reload(),
              },
              inventory.loading ? t('loading') : t('refresh')
            )
          )
        ),
        inventory.error && inventory.error !== 'unavailable'
          ? h('div', { className: 'dpm-error' }, t('loadFailed') + ': ' + inventory.error)
          : null,
        !api
          ? h(
              'div',
              { className: 'dpm-error' },
              t('noAccess') +
                (remote ? ' (' + t('sourceUnknown') + ': ' + Object.keys(remote).join(', ') + ')' : ' (remote=undefined)')
            )
          : null,
        inventory.loading && !items.length ? h('div', { className: 'dpm-empty' }, t('loading')) : null,
        !inventory.loading && !items.length && inventory.error !== 'unavailable'
          ? h('div', { className: 'dpm-empty' }, t('empty'))
          : null,
        h(
          'div',
          { className: 'dpm-list' },
          items.map((bundle) =>
            h(PluginCard, {
              key: bundle.name,
              bundle,
              liveRows: liveByEntry,
              t,
              localeId,
              pending: pending === bundle.name,
              confirming,
              setConfirming,
              expanded: !!expanded[bundle.name],
              onExpand: (name) =>
                setExpanded((prev) => ({ ...prev, [name]: !prev[name] })),
              onToggle: toggleBundle,
              onRemove: removeBundle,
              onToggleRow: toggleRow,
            })
          )
        ),
        toast ? h('div', { className: 'dpm-toast ' + toast.kind }, toast.text) : null
      );
    }

    function ManagerPanel(props) {
      return h(PanelBoundary, null, h(ManagerPage, props));
    }

    function EntryIcon() {
      return h(
        'svg',
        { viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': 'true' },
        h('rect', { x: '3', y: '4', width: '18', height: '6', rx: '2', stroke: 'currentColor', strokeWidth: '1.8' }),
        h('rect', { x: '3', y: '14', width: '18', height: '6', rx: '2', stroke: 'currentColor', strokeWidth: '1.8' }),
        h('circle', { cx: '8', cy: '7', r: '1.4', fill: 'currentColor' }),
        h('circle', { cx: '8', cy: '17', r: '1.4', fill: 'currentColor' }),
        h('path', { d: 'M12 7h5M12 17h5', stroke: 'currentColor', strokeWidth: '1.8', strokeLinecap: 'round' })
      );
    }

    function apply(ctx) {
      ctx.effect(() => ensureCss(), 'dsh-plugin-manager-style');

      let t = (key) => key;
      try {
        ctx.effect(() => ctx.locale.register(NS, { zh: ZH, en: EN }), 'dsh-plugin-manager-locale');
        t = ctx.locale.bind(NS);
      } catch (err) {
        console.warn('[dsh-plugin-manager] locale registration failed', err);
      }

      const label = () => {
        try {
          return t('nav');
        } catch (err) {
          return '插件管理';
        }
      };

      let layout;
      try {
        ctx.inject(['layout'], (scoped) => {
          layout = scoped.layout;
        });
      } catch (err) {
        layout = undefined;
        console.error('[dsh-plugin-manager] layout inject failed', err);
      }

      const openPanel = () => {
        try {
          if (layout && typeof layout.selectPanel === 'function') layout.selectPanel(PANEL_ID);
        } catch (err) {
          console.error('[dsh-plugin-manager] cannot open panel', err);
        }
      };

      const FooterEntry = (ownerProps) => {
        const wide = !!(ownerProps && ownerProps.wide);
        return h(
          'button',
          {
            type: 'button',
            className: 'dpm-entry' + (wide ? '' : ' rail'),
            title: label(),
            'aria-label': label(),
            onClick: openPanel,
          },
          h(EntryIcon),
          wide ? h('span', null, label()) : null
        );
      };

      ctx.slots.inject('sidebar.footer.action', () =>
        ctx.slots.register(
          {
            name: 'sidebar.footer.action',
            id: PANEL_ID,
            order: 10,
            locale: NS,
            label,
          },
          FooterEntry
        )
      );

      ctx.slots.inject('main', () =>
        ctx.slots.register(
          {
            name: 'main',
            key: PANEL_ID,
            locale: NS,
            inject: () => ({ ctx, t }),
          },
          ManagerPanel
        )
      );
    }

    return { inject: ['slots', 'locale', 'remote.pluginManager'], apply };
  },
});
