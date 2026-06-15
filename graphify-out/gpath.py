import json, sys
import networkx as nx
from networkx.readwrite import json_graph
from pathlib import Path

data = json.loads(Path('graphify-out/graph.json').read_text(encoding="utf-8"))
G = json_graph.node_link_graph(data, edges='links')

a_term = 'refreshAccessToken'
b_term = 'HTTP Client'

def find_node(term):
    term = term.lower()
    scored = sorted(
        [(sum(1 for w in term.split() if w in G.nodes[n].get('label','').lower()), n)
         for n in G.nodes()],
        reverse=True
    )
    return scored[0][1] if scored and scored[0][0] > 0 else None

src = find_node(a_term)
tgt = find_node(b_term)

print(f'Matched source: {G.nodes[src].get("label") if src else None}')
print(f'Matched target: {G.nodes[tgt].get("label") if tgt else None}')

if not src or not tgt:
    print(f'Could not find nodes matching: {a_term!r} or {b_term!r}')
    sys.exit(0)

try:
    path = nx.shortest_path(G, src, tgt)
    print(f'\nShortest path ({len(path)-1} hops):')
    for i, nid in enumerate(path):
        label = G.nodes[nid].get('label', nid)
        src_file = G.nodes[nid].get('source_file', '')
        loc = G.nodes[nid].get('source_location', '')
        if i < len(path) - 1:
            _raw = G[nid][path[i+1]]
            edge = next(iter(_raw.values()), {}) if isinstance(G, nx.MultiGraph) else _raw
            rel = edge.get('relation', '')
            conf = edge.get('confidence', '')
            score = edge.get('confidence_score', '')
            print(f'  [{label}] ({src_file} {loc})')
            print(f'    --{rel}--> [{conf} {score}]')
        else:
            print(f'  [{label}] ({src_file} {loc})')
except nx.NetworkXNoPath:
    print(f'No path found between the two nodes')
except nx.NodeNotFound as e:
    print(f'Node not found: {e}')
