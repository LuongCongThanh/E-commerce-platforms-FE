import json, sys
import networkx as nx
from networkx.readwrite import json_graph
from pathlib import Path

data = json.loads(Path('graphify-out/graph.json').read_text(encoding="utf-8"))
G = json_graph.node_link_graph(data, edges='links')

term = 'refreshAccessToken'
term_lower = term.lower()

scored = sorted(
    [(sum(1 for w in term_lower.split() if w in G.nodes[n].get('label','').lower()), n)
     for n in G.nodes()],
    reverse=True
)
if not scored or scored[0][0] == 0:
    print(f'No node matching {term!r}')
    sys.exit(0)

nid = scored[0][1]
data_n = G.nodes[nid]
print(f'NODE: {data_n.get("label", nid)}')
print(f'  source: {data_n.get("source_file","unknown")}')
print(f'  location: {data_n.get("source_location","unknown")}')
print(f'  type: {data_n.get("file_type","unknown")}')
print(f'  degree: {G.degree(nid)}')
print()
print('CONNECTIONS:')
for neighbor in G.neighbors(nid):
    _raw = G[nid][neighbor]
    edge = next(iter(_raw.values()), {}) if isinstance(G, nx.MultiGraph) else _raw
    nlabel = G.nodes[neighbor].get('label', neighbor)
    rel = edge.get('relation', '')
    conf = edge.get('confidence', '')
    score = edge.get('confidence_score', '')
    src_file = G.nodes[neighbor].get('source_file', '')
    loc = G.nodes[neighbor].get('source_location', '')
    print(f'  --{rel}--> {nlabel} [{conf} {score}] ({src_file} {loc})')
